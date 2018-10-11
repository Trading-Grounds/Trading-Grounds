var transaction = require('../controllers/transaction.controller');

module.exports = (app) => {
	
	//	GET Purchase Page
	app.get('/stock/buy/:symbol', isLoggedIn, (req, res) => {
		var symbol = req.params.symbol ? req.params.symbol.toUpperCase() : false;
		if(!symbol) { return res.render('dashboard', { error: 'Stock not found' })}
		transaction.getPurchase(req, res, symbol);
	});
	
	//	POST Purchase
	app.post('/stock/buy/:symbol', isLoggedIn, (req, res) => {
// 		console.log('\n\n\nUser:', req.user, '\n\n\n');
		transaction.recordPurchase(req, res);
// 		res.redirect('/stock/buy/' + req.params.symbol);
	});

	//	GET Sell Page
	app.get('/stock/sell/:symbol', isLoggedIn, (req, res) => {
		var symbol = req.params.symbol ? req.params.symbol.toUpperCase() : false;
		if(!symbol) { return res.render('dashboard', { error: 'Stock not found' })}
		transaction.getSell(req, res, symbol);
	})
	
	//	POST Sale
	app.post('/stock/sell/:symbol', isLoggedIn, (req, res) => {
		transaction.recordSale(req, res);
	});
	
	//	GET Watchlist
	app.get('/watchlist', isLoggedIn, transaction.getWatchlist);
	
	//	POST Add to Watchlist
	app.post('/watchlist/add/:symbol', isLoggedIn, transaction.addToWatchlist);
	
	//	POST Remove from Watchlist
	app.post('/watchlist/remove/:symbol', isLoggedIn, transaction.removeFromWatchlist);
}

//	Custom middleware for restricting access to protected views
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/');
	}
}