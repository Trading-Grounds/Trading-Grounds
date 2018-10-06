var db = require("../models");

module.exports = function (app) {

// GET Homepage
app.get('/', isNotLoggedIn, (req, res) => {
  res.render('index');
});

//=========Dustin's Temporary Routes for Working on New Files============//

app.get('/stock', (req, res) => {
  res.render('stock');
});

/*
app.get('/investments', (req, res) => {
  res.render('investments');
});
*/

app.get('/watchlist', (req, res) => {
  res.render('watchlist');
});

/*
app.get('/transactions', (req, res) => {
  res.render('transactions');
});
*/

/*
app.get('/purchase', (req, res) => {
  res.render('purchase');
});

app.get('/marketcap', (req, res) => {
  res.render('marketcap');
});

app.get('/volume', (req, res) => {
  res.render('volume');
});
*/

app.get('/gettingstarted', (req, res) => {
  res.render('gettingstarted');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});
//====================================================================//

//	Custom middleware for redirecting to dashboard if logged in
function isNotLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return res.redirect('/dashboard');
	} else {
		return next();
	}
}

// Render 404 page for any unmatched routes
app.get("*", function (req, res) {
  res.render("dashboard", {user: req.user});
});
};