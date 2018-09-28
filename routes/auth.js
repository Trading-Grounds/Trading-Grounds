var authController = require('../controllers/authcontroller');
// var expressValidator = require('express-validator');

// console.log('\n\n\n', authController, '\n\n\n');
module.exports = (app, passport) => {
	
	//	GET Registration
	app.get('/register', authController.register);
	
	//	POST Registration
	app.post('/register', validateRegistration, passport.authenticate('local-register', {
		successRedirect: '/dashboard',
		failureRedirect: '/register'
	}));
	
	//	GET Login
	app.get('/login', authController.login);
	
	//	POST Login
	app.post('/login', validateLogin, passport.authenticate('local-login', {
		successRedirect: '/dashboard',
		failureRedirect: '/login',
		failureFlash: true
	}));
	
	//	GET Logout
	app.get('/logout', authController.logout);
	
	//	GET Dashboard (Restricted Access)
	app.get('/dashboard', isLoggedIn, authController.dashboard);
	
	//	Custom middleware for restricting access to protected views
	function isLoggedIn(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/');
		}
	}
	
	//	Registration Form Validations
	function validateRegistration(req, res, next) {
		var validate = require('../functions/validations');
		var errors = [];
		var username = req.body.username.trim();
		var email = req.body.email.trim();
		var password = req.body.password.trim();
		var confirm_password = req.body.confirm_password.trim();
		var first_name = req.body.first_name.trim();
		var last_name = req.body.last_name.trim();
		
		var userInfo = {
			username: username,
			email: email,
			password: password,
			confirm_password: confirm_password,
			first_name: first_name,
			last_name: last_name
		};
		
		if(validate.is_blank(username)) {
			errors.push('Username cannot be blank');
		} else if(!validate.has_length(username, { min: 6, max: 25 })) {
			errors.push('Username must be between 6 and 25 characters');
		}
		
		if(validate.is_blank(email)) {
			errors.push('Email cannot be blank');
		} else if(!validate.has_valid_email_format(email)) {
			errors.push('Email must be a valid format');
		}
		
		if(validate.is_blank(password)) {
			errors.push('Password cannot be blank');
		} else if(!validate.has_length(password, { min: 8, max: 100 })) {
			errors.push('Password must be at least 8 characters long');
		} else if(!validate.has_uppercase(password)) {
			errors.push('Password must contain at least one upper case letter');
		} else if(!validate.has_lowercase(password)) {
			errors.push('Password must contain at least one lowercase letter');
		} else if(!validate.has_whitespace(password)) {
			errors.push('Password cannot contain any white spaces');
		} else if(!validate.has_number(password)) {
			errors.push('Password must contain at least one number');
		} else if(!validate.has_non_alphanumeric(password)) {
			errors.push('Password must contain at least one non-alphanumeric character');
		} else if(validate.is_blank(confirm_password)) {
			errors.push('Password confirmation cannot be blank');
		} else if(password !== confirm_password) {
			errors.push('Passwords do not match');
		}
		
		if(validate.is_blank(first_name)) {
			errors.push('First name cannot be blank');
		} else if(!validate.has_word_chars_only) {
			errors.push('First name cannot contain any special characters');
		}
		
		if(validate.is_blank(last_name)) {
			errors.push('Last name cannot be blank');
		} else if(!validate.has_word_chars_only) {
			errors.push('Last name cannot contain any special characters');
		}
		
		if(!validate.is_empty(errors)) {
			res.render('register', { errors: errors, user: userInfo });
		} else {
			return next();
		}
	}
	
	//	Login Form Validations
	function validateLogin(req, res, next) {
// 		console.log('\n\n\n', req.authInfo, '\n\n\n');
		var validate = require('../functions/validations');
		var errors = [];
		var username = req.body.username.trim();
		var password = req.body.password.trim();
		
		var userInfo = {
			username: username,
			password: password,
		};
		
		if(validate.is_blank(username)) {
			errors.push('Username cannot be blank');
		}
		
		if(validate.is_blank(password)) {
			errors.push('Password cannot be blank');
		}
		
		if(!validate.is_empty(errors)) {
			res.render('login', { errors: errors, user: userInfo });
		} else {
			return next();
		}
	}
}