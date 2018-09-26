var db = require("../models");
var yahooFinance = require("yahoo-finance");

module.exports = function (app) {
  // Get all examples
  app.get("/api/examples", function (req, res) {
    db.Example.findAll({}).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });


  // Create a new example
  app.post("/api/examples", function (req, res) {
    db.Example.create(req.body).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function (req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  // This returns the yahoo Finance info
  yahooFinance.quote({ symbol: "AAPL", modules: ["price", "summaryDetail"] }, function (err, quote) {
    if (err) {
      console.log("I'm sorry. We could not retrieve stock information.");
    } else {
      var stockData = [
        "Stock Name: " + quote.price.shortName,
        "Symbol: " + quote.price.symbol,
        "Purchasing Price: " + "$" + quote.summaryDetail.ask + " USD",
        "Selling Price: " + "$" + quote.summaryDetail.bid + " USD",
        "Current Date: " + quote.price.regularMarketTime
      ].join("\n");
      console.log(stockData);

    }

  });

};