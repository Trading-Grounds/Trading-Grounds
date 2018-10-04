var db = require("../models");

module.exports = function(app) {

	// GET Homepage
	app.get('/', (req, res) => {
		res.render('index');
  });
  
//Dustin's Temporary Routes for Working on New Files

app.get('/singlestock', (req, res) => {
  res.render('singlestock');
});

app.get('/investments', (req, res) => {
  res.render('investments');
});

app.get('/watchlist', (req, res) => {
  res.render('watchlist');
});

//===================================================


  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
