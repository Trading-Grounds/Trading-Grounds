var User = require('../models').user;
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var bcrypt = require('bcrypt-nodejs');

var reset = {};

reset.renderEmailForm = (req, res) => {
	var errors = req.flash('error');
	var messages = req.flash('info');
	console.log(messages);
	res.render('reset', { user: req.user, errors: errors, messages: messages });
};

reset.sendEmailToken = (req, res, next) => {

	//	Use async to handle deeply nested promises/callback functions
	async.waterfall([
		
		//	Generate a random token using crypto and pass it into the next callback function
		(done) => {
			
			crypto.randomBytes(20, (err, buf) => {
				var token = buf.toString('hex');
				done(err, token);
			});
		},
		
		//	Query DB to ensure email exists
		(token, done) => {
			
			User.findOne({
				where: { email: req.body.email }
			}).then(user => {
				if(!user) {
					req.flash('error', 'No account with that email address exists');
					return res.redirect('/reset');
				} else {
					user.reset_password_token = token;
					user.reset_password_expires = Date.now() + (1000*60*60);	// 1 hour
					
					user.save().then((err) => {

						var auth = {
							auth: {
								api_key: process.env.MAILGUN_API,
								domain: process.env.MAILGUN_DOMAIN
							}
						}
						var nodemailerMailgun = nodemailer.createTransport(mg(auth));
						
						var text = 'You are receiving this because someone has requested a password reset for your Trading Grounds account.\n\n';
						text += 'Please click on the following link or paste it in your browser to complete the process:\n\n';
						text += 'http://' + req.headers.host + '/reset/' + token + '\n\n';
						text += 'If you did not request this, please ignore this email and your password will remain unchanged.\n';
						
						//	Configure the email options
						var mailOptions = {
							to: user.email,
							from: 'passwordreset@tradinggrounds.com',
							subject: 'Password Reset - DO NOT REPLY',
							text: text
						};
						
						//	Send the email and set the req.flash 'info' message
						nodemailerMailgun.sendMail(mailOptions, (err, info) => {
							console.log('\n\nToken emailed: (', info, ')\n\n');
							req.flash('info', 'An email has been sent to ' + user.email + ' with further instructions');
							done(err, 'done');
						});
					});
				}
			});
		}		
	], err => {
		if(err) {
			return next(err);
		} else {
			res.redirect('/reset');
		}
	});
};

reset.renderResetForm = (req, res) => {
	
	//	Query DB for token AND ensure token has not already expired before redirecting to password reset view
	User.findOne({
		where: {
			reset_password_token: req.params.token,
			reset_password_expires: { $gt: Date.now() }
		}
	}).then(user => {
		if(!user) {
			req.flash('error', 'Password reset token is invalid or has expired');
			return res.redirect('/reset');
		} else {
			res.render('password-reset', { user: req.user }); // req.user uses the session user; user uses the query result
		}
	});
};

reset.resetPassword = (req, res) => {
	
	async.waterfall([
		
		(done) => {
			//	Query DB for token AND ensure token has not already expired before logging user in
			User.findOne({
				where: {
					reset_password_token: req.params.token,
					reset_password_expires: { $gt: Date.now() }
				}
			}).then(user => {
				if(!user) {
					req.flash('error', 'Password reset token is invalid or has expired');
					return res.redirect('/reset');
				} else {
					user.hashed_password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
					//	Unset passward reset variables
					user.reset_password_token = null;
					user.reset_password_expires = null;
					
					user.save().then(() => {
						
						req.login(user, err => {
							//	Configure email servie and transport method
							var auth = {
								auth: {
									api_key: process.env.MAILGUN_API,
									domain: process.env.MAILGUN_DOMAIN
								}
							}
							var nodemailerMailgun = nodemailer.createTransport(mg(auth));

							//	Configure the email options
							var mailOptions = {
								to: user.email,
								from: 'passwordreset@tradinggrounds.com',
								subject: 'Your password has been changed',
								text: 'Hello,\n\nThis is a confirmation that the password for your Trading Grounds account has been reset.\n'
							};
							//	Send the email and set the req.flash 'success' message
							nodemailerMailgun.sendMail(mailOptions, (err, info) => {
								console.log('\n\nPassword reset emailed: (', info, ')\n\n');
								req.flash('success', 'Your password has been updated successfully');
								done(err, 'done');
							});							
						});
					});
				}
			});
		}
	], err => {
		//	TODO: add success flash message to dashboard (or wherever we decide to redirect to upon success -- login??)
		res.redirect('/dashboard');
	});
};

module.exports = reset;