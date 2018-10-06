var app = require('../server');
var yahooFinance = require('yahoo-finance');
var moment = require('moment');

var User = require('../models').user;

var stocks = {};

stocks.dashboard = (req, res) => {
	User.findOne({ where: { id: req.user.id }}).then(user => {
		user.getInvestments({ order: [['purchase_date', 'ASC']]}).then(investments => {
			var hasInvestments = investments ? true : false;
			console.log('\n\n\nInvestments:', investments, '\n\n\n')
			
			getPortfolioData(investments, (portfolio) => {
				if(!portfolio) { portfolio = {}; }
				portfolio.cash = format(user.cash);
				console.log('\n\n\nPortfolio:', portfolio, '\n\n\n')
				
				accountInfo = {
					cash: format(user.cash),
					unformattedCash: user.cash,
					investmentsUnformatted: 0
				};
				
				//	40,363.94
				portfolio.forEach(obj => {
					accountInfo.investmentsUnformatted += obj.investment;
				});
				
				accountInfo.balanceUnformatted = accountInfo.investmentsUnformatted + parseFloat(accountInfo.unformattedCash);
				accountInfo.balance = format(accountInfo.balanceUnformatted);
				accountInfo.investments = format(accountInfo.investmentsUnformatted);
				accountInfo.roiUnformatted = (((accountInfo.balanceUnformatted / 50000) - 1) * 100);
				accountInfo.roi = accountInfo.roiUnformatted.toFixed(2) + ' %';
				
				var companies = ['AAPL', 'AMZN', 'MSFT', 'GOOG', 'FB'];
				
				findStocksByAPI(companies, [], 0, (stocks) => {
					res.render('dashboard', {
						user: req.user,
						hasInvestments: hasInvestments,
						investments: investments,
						portfolio: portfolio,
						accountInfo: accountInfo,
						ticker: stocks
					});
				});
			});
		});
	});
};

stocks.investments = (req, res) => {
	User.findOne({ where: { id: req.user.id }}).then(user => {
		user.getInvestments({ order: [['purchase_date', 'ASC']]}).then(investments => {
			var hasInvestments = investments ? true : false;
			console.log('\n\n\nInvestments:', investments, '\n\n\n')
			
			getPortfolioData(investments, (portfolio) => {
				if(!portfolio) { portfolio = {}; }
				portfolio.cash = format(user.cash);
				console.log('\n\n\nPortfolio:', portfolio, '\n\n\n')
				
				accountInfo = {
					cash: format(user.cash),
					unformattedCash: user.cash,
					investmentsUnformatted: 0
				};
				
				//	40,363.94
				portfolio.forEach(obj => {
					accountInfo.investmentsUnformatted += obj.investment;
				});
				
				accountInfo.balanceUnformatted = accountInfo.investmentsUnformatted + parseFloat(accountInfo.unformattedCash);
				accountInfo.balance = format(accountInfo.balanceUnformatted);
				accountInfo.investments = format(accountInfo.investmentsUnformatted);
				accountInfo.roiUnformatted = (((accountInfo.balanceUnformatted / 50000) - 1) * 100);
				accountInfo.roi = accountInfo.roiUnformatted.toFixed(2) + ' %';
				
				res.render('investments', {
					user: req.user,
					hasInvestments: hasInvestments,
					investments: investments,
					portfolio: portfolio,
					accountInfo: accountInfo
				});
			});
		});
	});
}

stocks.transactions = (req, res) => {
	User.findOne({ where: { id: req.user.id }}).then(user => {
		user.getTransactions().then(transactions => {
			var list = [];
			transactions.forEach(transaction => {
				var data = {
					type: transaction.transaction_type.toUpperCase(),
					date: moment(transaction.transaction_date, 'YYYY-MM-DD hh:mm:ss').format('MMMM DD, YYYY'),
					symbol: transaction.asset_symbol,
					name: transaction.asset_name,
					shares: transaction.quantity,
					price: format(parseFloat(transaction.price)),
					total: format(parseFloat(transaction.price) * parseFloat(transaction.quantity))
				};
				list.push(data);
			});
			res.render('transactions', {
				user: req.user,
				transactions: list
			});
		});
	});
}

function getPortfolioData(investments, callback) {
	if(!investments) { return false; }
	var symbols = [];
// 	var portfolio = {};
	var portfolio = [];
	investments.forEach(investment => {
		if(symbols.indexOf(investment.symbol) < 0) {
			var obj = {
				shares: investment.quantity,
				purchasePrice: investment.price,
				costs: investment.price * investment.quantity,
				symbol: investment.symbol,
				name: investment.name
			};
/*
			portfolio[investment.symbol].shares = investment.quantity;
			portfolio[investment.symbol].purchasePrice = investment.price;
			portfolio[investment.symbol].costs = investment.price * investment.quantity;
			portfolio[investment.symbol].symbol = investment.symbol;
			portfolio[investment.symbol].name = investment.name;
*/
			symbols.push(investment.symbol);
			portfolio.push(obj);
		} else {
			var index = symbols.indexOf(investment.symbol);
			portfolio[index].shares += investment.quantity;
			portfolio[index].costs += investment.price * investment.quantity;
/*
			portfolio[investment.symbol].shares += investment.quantity;
			portfolio[investment.symbol].costs += investment.price * investment.quantity;
*/
		}
	});
	
	function findStocksByAPI(cb) {
	
		if(count == 0) {
			console.log('\nSearching API for ' + symbols.length + ' companies...\n');
		}
		if(count < symbols.length) {
			
			yahooFinance.quote({ symbol: symbols[count], modules: ['summaryDetail', 'price' ]}, (err, quote) => {
				if(err) {
					console.log('Unable to find: ', symbols[count]);
					count++;
					findStocksByAPI(cb)
				} else {
					var sd = quote.summaryDetail ? quote.summaryDetail : {};
					
					if(sd.ask == 0 && sd.bid == 0) {
						var price = parseFloat(sd.previousClose);
					} else if(sd.ask == 0) {
						var price = parseFloat(sd.bid);
					} else {
						var price = parseFloat(sd.ask);
					}
					
					var change = format(price - parseFloat(sd.previousClose));
					if(parseFloat(change) < 0) {
						var gain = false;
					} else {
						var gain = true;
					}
					
/*
					var data = {
						price: format(price),
						name: quote.price.shortName ? quote.price.shortName : '-',
						symbol: quote.price.symbol ? quote.price.symbol : '-',
						change: format(price - parseFloat(sd.previousClose)),
						unformattedChange: (((price / parseFloat(sd.previousClose)) - 1) * 100),
						percentChange: (((price / parseFloat(sd.previousClose)) - 1) * 100).toFixed(2) + ' %',
						gain: (price - parseFloat(sd.previousClose) < 0) ? false : true,
						volume: sd.volume ? sd.volume : 0
					};
*/
// 					stocks.push(data);

					var index = symbols.indexOf(symbols[count]);
					portfolio[index].price = format(price);
					portfolio[index].unformattedPrice = price;
					portfolio[index].change = format(price - parseFloat(sd.previousClose));
					portfolio[index].unformattedChange = (((price / parseFloat(sd.previousClose)) - 1) * 100);
					portfolio[index].percentChange = (((price / parseFloat(sd.previousClose)) - 1) * 100).toFixed(2) + ' %';
					portfolio[index].gain = (price - parseFloat(sd.previousClose) < 0) ? false : true;
					portfolio[index].volume = sd.volume ? sd.volume : 0;
					portfolio[index].investment = parseInt(portfolio[index].shares) * parseFloat(price);
					portfolio[index].investmentFormatted = format(portfolio[index].investment);
					portfolio[index].gainLoss = format(portfolio[index].investment - portfolio[index].costs);
					portfolio[index].percentGainLoss = (((portfolio[index].investment / portfolio[index].costs) -1) * 100)
						.toFixed(2) + ' %';
					portfolio[index].positive = (portfolio[index].investment - portfolio[index].costs) < 0 ? false : true;
					portfolio[index].costsFormatted = format(portfolio[index].costs);
					
/*
					portfolio[symbols[count]].price = format(price);
					portfolio[symbols[count]].unformattedPrice = price;
					portfolio[symbols[count]].change = format(price - parseFloat(sd.previousClose));
					portfolio[symbols[count]].unformattedChange = (((price / parseFloat(sd.previousClose)) - 1) * 100);
					portfolio[symbols[count]].percentChange = (((price / parseFloat(sd.previousClose)) - 1) * 100).toFixed(2) + ' %';
					portfolio[symbols[count]].gain = (price - parseFloat(sd.previousClose) < 0) ? false : true;
					portfolio[symbols[count]].volume = sd.volume ? sd.volume : 0;
					portfolio[symbols[count]].investment = portfolio[symbols[count]].shares * price;
*/
					console.log(count + ' / ' + symbols.length);
					count++;
					findStocksByAPI(cb);
				}
			});
		} else {
			console.log(count + ' / ' + symbols.length);
			console.log('\nSearch Complete!\n');
			cb();
		}
	}
		
// 	var stocks = [];
	var count = 0;
	findStocksByAPI(() => {
// 		portfolio.symbols = symbols;
// 		portfolio.stocks = stocks;
		return callback(portfolio);
	});
}

//	Uses Recursion to handle asynchonous API calls, returning an array of stock data into the callback function
function findStocksByAPI(companies, stocks=[], count=0, cb) {
	
	if(count == 0) {
		console.log('\nSearching API for ' + companies.length + ' companies...\n');
	}
	if(count < companies.length) {
		
		yahooFinance.quote({ symbol: companies[count], modules: ['summaryDetail', 'price' ]}, (err, quote) => {
			if(err) {
				console.log('Unable to find: ', companies[count].symbol);
				count++;
				findStocksByAPI(companies, stocks, count, cb)
			} else {
				var sd = quote.summaryDetail ? quote.summaryDetail : {};
				
				if(sd.ask == 0 && sd.bid == 0) {
					var price = parseFloat(sd.previousClose);
				} else if(sd.ask == 0) {
					var price = parseFloat(sd.bid);
				} else {
					var price = parseFloat(sd.ask);
				}
				
				var change = format(price - parseFloat(sd.previousClose));
				if(parseFloat(change) < 0) {
					var gain = false;
				} else {
					var gain = true;
				}
				
				var data = {
					price: format(price),
					name: quote.price.shortName ? quote.price.shortName : '-',
					symbol: quote.price.symbol ? quote.price.symbol : '-',
					change: format(price - parseFloat(sd.previousClose)),
					unformattedChange: (((price / parseFloat(sd.previousClose)) - 1) * 100),
					percentChange: (((price / parseFloat(sd.previousClose)) - 1) * 100).toFixed(2) + ' %',
					gain: (price - parseFloat(sd.previousClose) < 0) ? false : true,
					volume: sd.volume ? sd.volume : 0
				};
				
				stocks.push(data);
				console.log(count + ' / ' + companies.length);
				count++;
				findStocksByAPI(companies, stocks, count, cb);
			}
		});
	} else {
		console.log(count + ' / ' + companies.length);
		console.log('\nSearch Complete!\n');
		cb(stocks);
	}
}

//	Formats numbers into custom strings (decimal places, commas, symbols, etc)
var format = (val=0, dec=2, den='$ ') => {
	var fixed = val.toFixed(dec);
	var parts = fixed.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return den + parts.join('.');
}

module.exports = stocks;