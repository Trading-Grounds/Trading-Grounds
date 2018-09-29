var bcrypt = require('bcrypt-nodejs');

module.exports = (passport, user) => {
	
	//	Initialize the User Model
	var User = user;
	//	Initialize the Passport-Local Strategy
	var LocalStrategy = require('passport-local').Strategy;
	
	//	Stores the user id in the session
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	
	//	Gets the user id from the session and attempts to find the user in the database
	passport.deserializeUser((id, done) => {
		User.findById(id).then(user => {
			if(user) {
				done(null, user.get());
			} else {
				done(user.errors, null);
			}
		});
	});
	
	//	Define custom strategy for Registration
	passport.use('local-register', new LocalStrategy(
		
		//	Arugments for new Local Strategy - sets passport variables to the POST request fields
		{
			usernameField: 'username',
			passwordField: 'password',
			passReqToCallback: true	// allows for passing back the entire request into the callback function below
		},
		
		//	Callback function that handles storing user's details
		function(req, username, password, done) {
			
			//	Takes plain-text password as argument and returns the hashed password
			var generateHash = (password) => {
				return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
			};
			
			//	Query DB to ensure user uniqueness before creating new user
			User.findOne({
				where: {
					username: username
				}
			}).then(user => {
				if(user) {
					return done(null, false, { message: 'Username already exits' });
				} else {
					var hashed_password = generateHash(password);
					var data = {
						username: username,
						email: req.body.email,
						hashed_password: hashed_password,
						first_name: req.body.first_name,
						last_name: req.body.last_name
					};
					
					User.create(data).then((newUser, created) => {
						if(!newUser) {
							return done(null, false);
						} else {
							return done(null, newUser);
						}
					});
				}
			});
		}
	));
	
	//	Define custom strategy for Login
	passport.use('local-login', new LocalStrategy(
		
		//	Arugments for new Local Strategy - sets passport variables to the POST request fields
		{
			usernameField: 'username',
			passwordField: 'password',
			passReqToCallback: true	// allows for passing back the entire request into the callback function below
		},
		
		//	Callback function that handles finding the user to login
		function(req, username, password, done) {
			
			var User = user;
			var isValidPassword = (userPassword, password) => {
				return bcrypt.compareSync(password, userPassword);
			};
			
			User.findOne({
				where: {
					username: username
				}
			}).then(user => {
				if(!user) {
					req.flash('username', req.body.username);
					req.flash('password', req.body.password);
					return done(null, false, { message: 'Username does not exist' });
				}
				if(!isValidPassword(user.hashed_password, password)) {
					req.flash('username', req.body.username);
					req.flash('password', req.body.password);
					return done(null, false, { message: 'Username and password do not match' });
				}
				var userInfo = user.get();
				return done(null, userInfo);
			}).catch(err => {
				console.log('Error:', err);
				return done(null, false, { message: 'Failed to log in' });
			});
		}
	));
}