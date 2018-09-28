// require("dotenv").config();
//	Set up and initialize express server
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

//	Dependencies/Imports
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');

//	User Authentication Dependencies
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

//	Env Variable Import
var env = require('dotenv').load();

// Set up Application Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(express.static('public'));
app.use(flash());

//	Set up User Authentication Middleware
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));	// session secret
app.use(passport.initialize());
app.use(passport.session());	// persistent login sessions

// Set up Handlebars/View Engine
app.set('views', './views');
/*
app.engine(
	"handlebars",
	exphbs({
		defaultLayout: "main"
	})
);
*/
app.engine('hbs', exphbs({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');

//	Import DB Models
var models = require('./models');

// Routes
var authRoutes = require('./routes/auth')(app, passport);
// var reset = require('./routes/reset')(app);
var apiRoutes = require('./routes/apiRoutes')(app);
var htmlRoutes = require('./routes/htmlRoutes')(app);

//	Import Passport Strategies
require('./config/passport/passport')(passport, models.user);

//	Database Syncing Options
var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
	syncOptions.force = true;
}

// Sync the models and start the server
models.sequelize.sync(syncOptions).then(() => {
	app.listen(PORT, err => {
		if(!err) {
			console.log(
				"==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
				PORT,
				PORT
			);
		} else {
			console.log(err);
		}
	});
});

module.exports = app;