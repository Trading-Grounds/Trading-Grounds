var db = require("../models");
var yahooFinance = require("yahoo-finance");
var authController = require('../controllers/authcontroller');

module.exports = function (app) {
  // Get all examples

  app.get("/api/topStock", function (req, res) {
    console.log("Route??????")
    db.TopStock.findAll({}).then(function (dbTopStocks) {
      // console.log(dbTopStocks);
      // res.json(dbTopStocks);
      var stocks = [];
      for (let i = 0; i < dbTopStocks.length; i++) {
        console.log(dbTopStocks[i].symbol);
        if (dbTopStocks[i].symbol && dbTopStocks[i].symbol.trim() != "") {
          stocks.push(dbTopStocks[i].symbol.trim())
        };

      }

      yahooFinance.quote({ symbols: AAPL, modules: ["price", "summaryDetail"] }, function (err, quote) {
        if (err) {
          console.log("Stock Info Not Available");
        } else {
          var tickerData = [];
          Object.keys(quote).forEach(function (ticker) {
            tickerData.push({
              symbol: quote[ticker].price.symbol,
              price: " $" + quote[ticker].summaryDetail.bid,
              sellPrice: " $" + quote[ticker].summaryDetail.bid,
              stockName: quote[ticker].price.shortName,
              open: "$" + quote[ticker].summaryDetail.open,
              fiftyTwoWeekHigh: "$" + quote[ticker].summaryDetail.fiftyTwoWeekHigh,
              fiftyTwoWeekLow: + "$" + quote[ticker].summaryDetail.fiftyTwoWeekLow
            });
          })
          console.log(tickerData)
          res.render("dashboard", {
            ticker: tickerData
          });
          // console.log(quote);

        }
      })
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
      yahooFinance.quote({
        symbol: req.params.symbol,
        modules: ["price", "summaryDetail"]
      }, function (err, quote) {
        if (err) {
          console.log("I'm sorry. We could not retrieve stock information.");
        } else {
          var stockData = [
            "Stock Name: " + quote.price.shortName,
            "Symbol: " + quote.price.symbol,
            "Purchasing Price: " + "$" + quote.summaryDetail.ask + " USD",
            "Selling Price: " + "$" + quote.summaryDetail.bid + " USD",
            "Open: " + "$" + quote.summaryDetail.open + " USD",
            "52 Week High: " + "$" + quote.summaryDetail.fiftyTwoWeekHigh + " USD",
            "52 Week Low: " + "$" + quote.summaryDetail.fiftyTwoWeekLow + " USD",
            "Current Date: " + quote.price.regularMarketTime
          ].join("\n");
          console.log(stockData);
          yahooFinance.historical({
            symbol: req.params.symbol,
            from: '2018-09-21',
            to: '2018-09-27',
            period: 'd'
          }, function (err, quotes) {
            if (err) {
              throw err;
            } else {
              for (var i = 0; i < quotes.length; i++) {
                var historicalData = [
                  "Date: " + quotes[i].date,
                  "High: " + quotes[i].high,
                  "Low: " + quotes[i].low
                ].join("\n\n")
                console.log(historicalData);
                res.render("dashboard", {
                  stockInfo: stockData,
                  historicalData: historicalData
                })

              }
            };
          });
        }

      });
      // res.json(dbTopStocks);
    });
  });





};