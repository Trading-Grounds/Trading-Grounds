var app = require('../server');
var yahooFinance = require('yahoo-finance');
var Investment = require('../models').Investment;
var Transaction = require('../models').Transaction;
var User = require('../models').user;
var Watchlist = require('../models').Watchlist;
var validations = require('../functions/validations');

var transaction = {};

transaction.getPurchase = (req, res, symbol) => {
	var errors = req.flash('error');
	var user = req.flash('user')[0];
	
	var modules = ['summaryDetail', 'price', 'financialData', 'defaultKeyStatistics', 'summaryProfile'];
	
	yahooFinance.quote({ symbol: symbol, modules: modules }, (err, quote) => {
		if(err) {
			return res.redirect('/stock' + symbol);
		} else {
			var sd = quote.summaryDetail ? quote.summaryDetail : {};
			var sp = quote.summaryProfile ? quote.summaryProfile : {};
			var fd = quote.financialData ? quote.financialData : {};
			var dks = quote.defaultKeyStatistics ? quote.defaultKeyStatistics : {};
			
			if(sd.ask == 0 && sd.bid == 0) {
				var price = parseFloat(sd.previousClose);
			} else if(sd.ask == 0) {
				var price = parseFloat(sd.bid);
			} else {
				var price = parseFloat(sd.ask);
			}
			
			var priceFormatted = format(price, 2);
			
			var div = sd.dividendRate ? format(sd.dividendRate, 2, '') + ' %' : '-';
			var yield = sd.dividendYield ? (sd.dividendYield * 100).toFixed(2) + ' %' : '-';
			
			var change = format(price - parseFloat(sd.previousClose));
			if(parseFloat(change) < 0) {
				var gain = false;
			} else {
				var gain = true;
			}
			
			if(sd.marketCap) {
				var mc = sd.marketCap.toString();
				var abr;
				if(mc.length < 4) {
					abr = '';
				} else if(mc.length < 7) {
					abr = ' K';
				} else if(mc.length < 10) {
					abr = ' M';
				} else if(mc.length < 13) {
					abr = ' B';
				} else {
					abr = ' T';
				}
				if(mc.length >= 3) {
					mc = mc[0] + mc[1] + mc[2];
				}
				mc = '$ ' + mc + abr;
			} else {
				mc = '-';
			}
			
			stockInfo = {
				open: sd.open ? format(sd.open) : '-',
				close: sd.previousClose ? format(sd.previousClose) : '-',
				high: sd.dayHigh ? format(sd.dayHigh) : '-',
				low: sd.dayLow ? format(sd.dayLow) : '-',
				div: div,
				yield: yield,
				beta: sd.beta ? sd.beta.toFixed(3) : '-',
				pe: sd.trailingPE ? sd.trailingPE.toFixed(3) : '-',
				bid: sd.bid ? sd.bid : '-',
				bidSize: sd.bidSize ? sd.bidSize : '-',
				ask: sd.ask ? sd.ask : '-',
				askSize: sd.askSize ? sd.askSize : '-',
				marketCap: mc,
				fiftyTwoHigh: sd.fiftyTwoWeekHigh ? format(sd.fiftyTwoWeekHigh) : '-',
				fiftyTwoLow: sd.fiftyTwoWeekLow ? format(sd.fiftyTwoWeekLow) : '-',
				volume: sd.volume ? format(sd.volume, 0, '') : '-',
				recommendation: fd.recommendationKey ? fd.recommendationKey : '-',
				eps: dks.trailingEps ? dks.trailingEps : '-',
				street: sp.address1 ? sp.address1 : '-',
				city: sp.city ? sp.city : '-',
				state: sp.state ? sp.state : '-',
				zip: sp.zip ? sp.zip : '-',
				country: sp.country ? sp.country : '-',
				employees: sp.fullTimeEmployees ? format(sp.fullTimeEmployees, 0, '') : '-',
				phone: sp.phone ? sp.phone : '-',
				website: sp.website ? sp.website : '-',
				sector: sp.sector ? sp.sector : '-',
				industry: sp.industry ? sp.industry : '-',
				summary: sp.longBusinessSummary ? sp.longBusinessSummary : '-',
				name: quote.price.shortName ? quote.price.shortName : '-',
				symbol: quote.price.symbol ? quote.price.symbol : '-',
				price: priceFormatted,
				priceUnformatted: price,
				change: format(price - parseFloat(sd.previousClose)),
				percentChange: (((price / parseFloat(sd.previousClose)) - 1) * 100).toFixed(2) + ' %',
				gain: (price - parseFloat(sd.previousClose) < 0) ? false : true
			};
			stockInfo.user = req.user ? req.user : {};
			stockInfo.user.cashFormatted = format(req.user.cash);
			console.log('\n\n\nUser:', req.user, '\n\n\n');
			res.render('purchase', stockInfo);
		}
	});
};

transaction.getSell = (req, res, symbol) => {
	
	var errors = req.flash('error');
	var user = req.flash('user')[0];
	
	var modules = ['summaryDetail', 'price', 'financialData', 'defaultKeyStatistics', 'summaryProfile'];
	
	yahooFinance.quote({ symbol: symbol, modules: modules }, (err, quote) => {
		if(err) {
			return res.redirect('/stock' + symbol);
		} else {
			var sd = quote.summaryDetail ? quote.summaryDetail : {};
			var sp = quote.summaryProfile ? quote.summaryProfile : {};
			var fd = quote.financialData ? quote.financialData : {};
			var dks = quote.defaultKeyStatistics ? quote.defaultKeyStatistics : {};
			
			if(sd.ask == 0 && sd.bid == 0) {
				var price = parseFloat(sd.previousClose);
			} else if(sd.ask == 0) {
				var price = parseFloat(sd.bid);
			} else {
				var price = parseFloat(sd.ask);
			}
			
			var priceFormatted = format(price, 2);
			
			var div = sd.dividendRate ? format(sd.dividendRate, 2, '') + ' %' : '-';
			var yield = sd.dividendYield ? (sd.dividendYield * 100).toFixed(2) + ' %' : '-';
			
			var change = format(price - parseFloat(sd.previousClose));
			if(parseFloat(change) < 0) {
				var gain = false;
			} else {
				var gain = true;
			}
			
			if(sd.marketCap) {
				var mc = sd.marketCap.toString();
				var abr;
				if(mc.length < 4) {
					abr = '';
				} else if(mc.length < 7) {
					abr = ' K';
				} else if(mc.length < 10) {
					abr = ' M';
				} else if(mc.length < 13) {
					abr = ' B';
				} else {
					abr = ' T';
				}
				if(mc.length >= 3) {
					mc = mc[0] + mc[1] + mc[2];
				}
				mc = '$ ' + mc + abr;
			} else {
				mc = '-';
			}
			
			stockInfo = {
				open: sd.open ? format(sd.open) : '-',
				close: sd.previousClose ? format(sd.previousClose) : '-',
				high: sd.dayHigh ? format(sd.dayHigh) : '-',
				low: sd.dayLow ? format(sd.dayLow) : '-',
				div: div,
				yield: yield,
				beta: sd.beta ? sd.beta.toFixed(3) : '-',
				pe: sd.trailingPE ? sd.trailingPE.toFixed(3) : '-',
				bid: sd.bid ? sd.bid : '-',
				bidSize: sd.bidSize ? sd.bidSize : '-',
				ask: sd.ask ? sd.ask : '-',
				askSize: sd.askSize ? sd.askSize : '-',
				marketCap: mc,
				fiftyTwoHigh: sd.fiftyTwoWeekHigh ? format(sd.fiftyTwoWeekHigh) : '-',
				fiftyTwoLow: sd.fiftyTwoWeekLow ? format(sd.fiftyTwoWeekLow) : '-',
				volume: sd.volume ? format(sd.volume, 0, '') : '-',
				recommendation: fd.recommendationKey ? fd.recommendationKey : '-',
				eps: dks.trailingEps ? dks.trailingEps : '-',
				street: sp.address1 ? sp.address1 : '-',
				city: sp.city ? sp.city : '-',
				state: sp.state ? sp.state : '-',
				zip: sp.zip ? sp.zip : '-',
				country: sp.country ? sp.country : '-',
				employees: sp.fullTimeEmployees ? format(sp.fullTimeEmployees, 0, '') : '-',
				phone: sp.phone ? sp.phone : '-',
				website: sp.website ? sp.website : '-',
				sector: sp.sector ? sp.sector : '-',
				industry: sp.industry ? sp.industry : '-',
				summary: sp.longBusinessSummary ? sp.longBusinessSummary : '-',
				name: quote.price.shortName ? quote.price.shortName : '-',
				symbol: quote.price.symbol ? quote.price.symbol : '-',
				price: priceFormatted,
				priceUnformatted: price,
				change: format(price - parseFloat(sd.previousClose)),
				percentChange: (((price / parseFloat(sd.previousClose)) - 1) * 100).toFixed(2) + ' %',
				gain: (price - parseFloat(sd.previousClose) < 0) ? false : true
			};
			stockInfo.user = req.user ? req.user : {};
			stockInfo.user.cashFormatted = format(req.user.cash);
			console.log('\n\n\nUser:', req.user, '\n\n\n');
			res.render('sale', stockInfo);
		}
	});
};

transaction.getWatchlist = (req, res) => {
	console.log('test0');
	User.findOne({ where: { id: req.user.id }}).then(user => {
		user.getWatchlists().then(watchlist => {
			var stocks = [];
			watchlist.forEach(listItem => {
				stocks.push(listItem.symbol);
			});
			console.log('test1');
			findStocksByAPI(stocks, [], 0, stocks => {
				console.log('test2');
				return res.render('watchlist', {
					user: req.user,
					watchlist: stocks
				});
			});
		});
	});
};

transaction.recordPurchase = (req, res) => {
	console.log('\n\n\nData:', req.body, '\n\n\n');
	var investment = {
		name: req.body.name,
		symbol: req.body.symbol,
		date_purchased: req.body.date_purchased,
		quantity: req.body.quantity,
		price: req.body.price,
		user_id: req.user.id
	};
	if((parseFloat(investment.price) * parseInt(investment.quantity)) > parseFloat(req.user.cash)) {
		console.log('Insufficient funds for this purchase.');
		return res.json({ message: 'Insufficient funds for this purchase!', error: true });
// 		return res.redirect('/stock/' + investment.symbol);
	}
	Investment.create(investment).then(() => {
		var transaction = {
			transaction_type: req.body.transaction_type,
			transaction_date: req.body.transaction_date,
			asset_name: req.body.asset_name,
			quantity: req.body.quantity,
			price: req.body.price,
			user_id: req.user.id,
			asset_symbol: req.body.symbol
		};
		Transaction.create(transaction).then(() => {
			User.findOne({
				where: { id: req.user.id }
			}).then(user => {
				var cost = parseFloat(req.body.price) * parseInt(req.body.quantity);
				user.cash -= cost;
			
				user.save().then(() => {
					console.log('\nInvestment and Transaction recorded!\n');
// 					res.json({ message: 'Transaction recorded!' });
					return res.json({
						message: req.body.quantity + ' ' + req.body.symbol + ' stock purchased for $ ' + cost.toFixed(2) + '!',
						error: false
					});
				});
			});			
		});
	});
};

transaction.recordSale = (req, res) => {
	User.findOne({
		where: {
			id: req.user.id,
		}
	}).then(user => {
		user.getInvestments({
			where: {
				symbol: req.body.symbol
			},
			order: [['purchase_date', 'ASC']]
		}).then(investments => {
			var quantity = req.body.quantity;
			var totalQuantity = 0;
			investments.forEach(investment => {
				totalQuantity += investment.quantity;
			});
			if(quantity > totalQuantity) {
				console.log('Error: Shares sold cannot exceed shares owned');
				return res.json({
					message: 'Shares sold cannot exceed shares owned!',
					error: true
				});
			}
			var quantityRemaining = req.body.quantity;
			
			var count = 0;
			
			function sellStocks(cb) {
				if(count < investments.length) {
					var investment = investments[count];
					if(quantityRemaining > 0 && investment.quantity >= quantityRemaining) {
						investment.quantity -= quantityRemaining;
						if(investment.quantity > 0) {
							investment.save().then((investment) => {
								console.log('\n\nStock Sold!\n\n');
								console.log(investment.quantity + ' remaining!\n\n');
								return cb();
							});
						} else {
							investment.destroy().then(() => {
								console.log('\n\nStock Sold!\n\n');
								console.log('Investment deleted!\n\n');
								return cb();
							});
						}
					} else if(quantityRemaining > 0) {
						quantityRemaining -= investment.quantity;
						investment.destroy().then(() => {
							count++;
							console.log('Investment deleted!\n\n');
							sellStocks(cb);
						});
					} else {
						return cb();
					}
				} else {
					return cb();
				}
			}
			
			sellStocks(() => {
				var transaction = {
					transaction_type: req.body.transaction_type,
					transaction_date: req.body.transaction_date,
					asset_name: req.body.asset_name,
					quantity: req.body.quantity,
					price: req.body.price,
					user_id: req.user.id,
					asset_symbol: req.body.symbol
				};
				Transaction.create(transaction).then(() => {
					var revenue =  parseFloat(req.body.price) * parseInt(req.body.quantity);
					user.cash += revenue;
					
					user.save().then(() => {
						console.log('\n\nCash Updated\n\n');
						return res.json({
							message: req.body.quantity + ' ' + req.body.symbol + ' stock sold for $ ' + revenue.toFixed(2) + '!',
							error: false
						});
					});
				});
			});
		});
	});
};

transaction.addToWatchlist = (req, res) => {
	var symbol = req.body.symbol.trim().toUpperCase();
	User.findOne({ where: { id: req.user.id }}).then(user => {
		user.getWatchlists({ where: { symbol: symbol }}).then(alreadyExists => {
			console.log('\n\n\n', alreadyExists);
			if(!validations.is_empty(alreadyExists)) {
				console.log('Stock is already on watchlist.');
				res.json({ message: 'Stock is already on watchlist.', error: true });
			} else {
				Watchlist.create({
					name: req.body.name,
					symbol: symbol,
					user_id: req.user.id
				}).then(() => {
					res.json({ message: symbol + ' added to watchlist!', error: false });
				});
			}
		});
	});
};

transaction.removeFromWatchlist = (req, res) => {
	User.findOne({ where: { id: req.user.id }}).then(user => {
		user.getWatchlists({ where: { symbol: req.body.symbol }, limit: 1}).then(watchlist => {
			console.log('\n\n\nWatchlist:', watchlist, '\n\n\n');
/* 			res.json({ message: 'Item removed from watchlist!' }); */
			watchlist[0].destroy().then(() => {
				res.json({ message: 'Item removed from watchlist!', error: false });
			});
		});
	});
};

var format = (val=0, dec=2, den='$ ') => {
	var fixed = val.toFixed(dec);
	var parts = fixed.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return den + parts.join('.');
};

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

module.exports = transaction;