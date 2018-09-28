var db = require("../models");
var yahooFinance = require("yahoo-finance");

module.exports = function (app) {
  // Get all examples

  app.get("/api/topStock", function (req, res) {
    console.log("Route??????")
    db.TopStock.findAll({}).then(function (dbTopStocks) {
      console.log(dbTopStocks);
      res.json(dbTopStocks);
    });
  });

  app.get("/api/topStock/:symbol", function (req, res) {
    // Here we add an "include" property to our options in our findOne query
    //We will probably need to link this to our Account
    db.TopStock.findOne({
      where: {
        symbol: req.params.symbol
      },
      // include: [db.Account]?? /////TODO LATER
    }).then(function (dbTopStocks) {
      // This returns the yahoo Finance info
      yahooFinance.quote({ symbol: req.params.symbol, modules: ["price", "summaryDetail"] }, function (err, quote) {
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
      res.json(dbTopStocks);
    });
  });


  // add in a new stock
  app.post("/api/topStock", function (req, res) {
    db.TopStock.create(req.body).then(function (dbTopStocks) {
      res.json(dbTopStocks);
    });
  });

};

