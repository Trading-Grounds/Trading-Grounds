/*
var resetController = require('../controllers/resetcontroller');

module.exports = (app) => {
	
	//	GET Forgot Password
	app.get('/reset', resetController.renderEmailForm);
	
	//	POST Forgot Password
	app.post('/reset', resetController.sendEmailToken);
	
	//	GET Password Reset
	app.get('/reset/:token', resetController.renderResetForm);
	
	//	POST Password Reset
	app.post('/reset/:token', resetController.resetPassword);
	
}
*/