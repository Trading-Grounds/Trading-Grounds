var app = require('../server');
var auth = {};

auth.register = (req, res) => {
	var errors = req.flash('error');
	var user = req.flash('user')[0];
// 	console.log('\n\n\n', errors, '\n\n\n')
	console.log('\n\n\n', req.flash(), '\n\n\n')
// 	console.log('\n\n\n', user, '\n\n\n');
	res.render('register', { errors: errors, user: user });
};

auth.login = (req, res) => {
	var errors = req.flash('error');
	var username = req.flash('username');
	var password = req.flash('password');
	var user = {
		username: username,
		password: password
	}
	console.log('\n\n\n', errors, '\n\n\n');
// 	console.log('\n\n\n', user, '\n\n\n');
	res.render('login', { errors: errors, user: user });
};

auth.logout = (req, res) => {
	req.session.destroy(err => {
		res.redirect('/dashboard');
	});
};

auth.dashboard = (req, res) => {
	// res.render('dashboard', { user: req.user });
	res.redirect("/api/topStock");
};

module.exports = auth;