var app = require('../server');
var yahooFinance = require('yahoo-finance');
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
			
// 				var priceFormatted = parseFloat(price).toFixed(2);
// 				priceFormatted = priceFormatted.toLocaleString();
			
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
/*
			if(sd.dividendRate == undefined) {
				var div = '-';
			} else {
				var div = sd.dividendRate
			}
*/
			
/*
			var open = sd.open ? format(sd.open) : '-';
			var close = sd.previousClose ? format(sd.previousClose) : '-';
			var high = sd.dayHigh ? format(sd.dayHigh) : '-';
			var low = sd.dayLow ? format(sd.dayLow) : '-';
			var beta = sd.beta ? sd.beta.toFixed(3) : '-';
			var bid = sd.bid ? sd.bid : '-';
			var bidSize = sd.bidSize ? sd.bidSize : '-';
			var ask = sd.ask ? sd.ask : '-';
			var askSize = sd.askSize ? sd.askSize : '-';
			
*/
			
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
				change: format(price - parseFloat(sd.previousClose)),
				percentChange: (((price / parseFloat(sd.previousClose)) - 1) * 100).toFixed(2) + ' %',
				gain: (price - parseFloat(sd.previousClose) < 0) ? false : true
			};
			stockInfo.user = req.user ? req.user : {};
			console.log('\n\n\nUser:', req.user, '\n\n\n');
			res.render('purchase', stockInfo);
		}
	});
};

var format = (val=0, dec=2, den='$ ') => {
	var fixed = val.toFixed(dec);
	var parts = fixed.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return den + parts.join('.');
}

module.exports = transaction;