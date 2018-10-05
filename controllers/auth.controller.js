var app = require('../server');
var auth = {};

auth.register = (req, res) => {
	var errors = req.flash('error');
	var user = req.flash('user')[0];
// 	console.log('\n\n\n', errors, '\n\n\n')
	console.log('\n\n\n', req.flash(), '\n\n\n')
// 	console.log('\n\n\n', user, '\n\n\n');
	res.render('register', { errors: errors, user: user });
};

auth.login = (req, res) => {
	var errors = req.flash('error');
	var username = req.flash('username');
	var password = req.flash('password');
	var user = {
		username: username,
		password: password
	}
	console.log('\n\n\n', errors, '\n\n\n');
// 	console.log('\n\n\n', user, '\n\n\n');
	res.render('login', { errors: errors, user: user });
};

auth.logout = (req, res) => {
	req.session.destroy(err => {
		res.redirect('/dashboard');
	});
};

auth.dashboard = (req, res) => {
	var user = req.user;
	var investments = user.getInvestments;
	var hasInvestments = investments ? true : false;
	var portfolio = getPortfolioData(investments);
	if(!portfolio) { portfolio = {}; }
	portfolio.cash = format(user.cash);
	console.log('\n\n\n', portfolio, '\n\n\n')
	
	res.render('dashboard', {
		user: req.user,
		hasInvestments: hasInvestments,
		investments: investments,
		portfolio: portfolio
	});
};

function getPortfolioData(investments) {
	if(!investments) { return false; }
	var symbols = [];
	var portfolio = {};
	investments.forEach(investment => {
		if(symbols.indexOf(investment.symbol) < 0) {
			portfolio[investment.symbol].shares = investment.quantity;
			portfolio[investment.symbol].purchasePrice = investment.price;
			portfolio[investment.symbol].costs = investment.price * investment.quantity;
			portfolio[investment.symbol].symbol = investment.symbol;
			portfolio[investment.symbol].name = investment.name;
			symbols.push(investment.symbol);
		} else {
			portfolio[investment.symbol].shares += investment.quantity;
			portfolio[investment.symbol].costs += investment.price * investment.quantity;
		}
	});
	
	function findStocksByAPI(cb) {
	
		if(count == 0) {
			console.log('\nSearching API for ' + symbols.length + ' companies...\n');
		}
		if(count < companies.length) {
			
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
					
					portfolio[symbols[count]].price = format(price);
					portfolio[symbols[count]].unformattedPrice = price;
					portfolio[symbols[count]].change = format(price - parseFloat(sd.previousClose));
					portfolio[symbols[count]].unformattedChange = (((price / parseFloat(sd.previousClose)) - 1) * 100);
					portfolio[symbols[count]].percentChange = (((price / parseFloat(sd.previousClose)) - 1) * 100).toFixed(2) + ' %';
					portfolio[symbols[count]].gain = (price - parseFloat(sd.previousClose) < 0) ? false : true;
					portfolio[symbols[count]].volume = sd.volume ? sd.volume : 0;
					portfolio[symbols[count]].investment = portfolio[symbols[count]].shares * price;
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
		
	var stocks = [];
	var count = 0;
	findStocksByAPI(() => {
		portfolio.symbols = symbols;
		portfolio.stocks = stocks;
		return portfolio;
	});
}

//	Formats numbers into custom strings (decimal places, commas, symbols, etc)
var format = (val=0, dec=2, den='$ ') => {
	var fixed = val.toFixed(dec);
	var parts = fixed.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return den + parts.join('.');
}

module.exports = auth;