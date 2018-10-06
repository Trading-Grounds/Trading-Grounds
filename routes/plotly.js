
//////////////////ALL OF THIS IS NEEDED FOR THE GRAPH///////////////////

var yahooFinance = require("yahoo-finance");
var moment = require("moment")

module.exports = function (app) {
    app.get("/api/graph/oneMonth/:symbol", function (req, res) {
        var today = moment().format()
        var oneMonthAgo = moment().subtract(1, "month").format();

        yahooFinance.historical({
            symbols: [req.params.symbol],

            from: oneMonthAgo,
            to: today

        },

            function (err, quote) {
                if (err) {
                    console.log("Stock Info Not Available");
                } else {

                    var stocks = [];
                    // console.log("quote is", quote)
                    Object.keys(quote).forEach(function (i) {
                        console.log(i);
                        for (let k = 0; k < quote[i].length; k++) {
                            var high = quote[i][k].high;
                            var date = quote[i][k].date;

                            stocks.push({ "symbol": i, "highestPrice": high, "date": date })
                        }

                    })
                    res.json(stocks)
                }
            })
    })

    app.get("/api/graph/oneWeek/:symbol", function (req, res) {
        var today = moment().format()
        var oneWeekAgo = moment().subtract(1, "week").format();

        yahooFinance.historical({
            symbols: [req.params.symbol],

            from: oneWeekAgo,
            to: today

        },

            function (err, quote) {
                if (err) {
                    console.log("Stock Info Not Available");
                } else {

                    var stocks = [];
                    // console.log("quote is", quote)
                    Object.keys(quote).forEach(function (i) {
                        console.log(i);
                        for (let k = 0; k < quote[i].length; k++) {
                            var high = quote[i][k].high;
                            var date = quote[i][k].date;

                            stocks.push({ "symbol": i, "highestPrice": high, "date": date })
                        }

                    })
                    res.json(stocks)
                }
            })
    })

    app.get("/api/graph/sixmonths/:symbol", function (req, res) {

        var today = moment().format()
        var sixMonthsAgo = moment().subtract(6, "months").format();
        yahooFinance.historical({

            symbols: [req.params.symbol],
            from: sixMonthsAgo,
            to: today
        },

            function (err, quote) {
                if (err) {
                    console.log("Stock Info Not Available");
                } else {

                    var stocks = [];
                    // console.log("quote is", quote)
                    Object.keys(quote).forEach(function (i) {
                        console.log(i);
                        for (let k = 0; k < quote[i].length; k++) {
                            var high = quote[i][k].high;
                            var date = quote[i][k].date;

                            stocks.push({ "symbol": i, "highestPrice": high, "date": date })
                        }

                    })
                    res.json(stocks)
                }
            })
    })

    app.get("/api/graph/oneyear/:symbol", function (req, res) {

        var today = moment().format()
        var oneYearAgo = moment().subtract(1, "year").format();

        yahooFinance.historical({
            symbols: [req.params.symbol],
            from: oneYearAgo,
            to: today
        },

            function (err, quote) {
                if (err) {
                    console.log("Stock Info Not Available");
                } else {

                    var stocks = [];
                    // console.log("quote is", quote)
                    Object.keys(quote).forEach(function (i) {
                        console.log(i);
                        for (let k = 0; k < quote[i].length; k++) {
                            var high = quote[i][k].high;
                            var date = quote[i][k].date;

                            stocks.push({ "symbol": i, "highestPrice": high, "date": date })
                        }

                    })
                    res.json(stocks)
                }
            })
    })

    app.get("/api/graph/fiveyear/:symbol", function (req, res) {

        var today = moment().format()
        var fiveYearsAgo = moment().subtract(5, "years").format();

        yahooFinance.historical({
            symbols: [req.params.symbol],
            from: fiveYearsAgo,
            to: today
        },

            function (err, quote) {
                if (err) {
                    console.log("Stock Info Not Available");
                } else {

                    var stocks = [];
                    // console.log("quote is", quote)
                    Object.keys(quote).forEach(function (i) {
                        console.log(i);
                        for (let k = 0; k < quote[i].length; k++) {
                            var high = quote[i][k].high;
                            var date = quote[i][k].date;

                            stocks.push({ "symbol": i, "highestPrice": high, "date": date })
                        }

                    })
                    res.json(stocks)
                }
            })
    })


    //// TEST PURPOSES////
    app.get('/api/graph/test', function (req, res) {
        res.render("testGraph")
    })

}

