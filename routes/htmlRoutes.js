var db = require("../models");

module.exports = function(app) {

	// GET Homepage
	app.get('/', (req, res) => {
		res.render('index');
	});

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
