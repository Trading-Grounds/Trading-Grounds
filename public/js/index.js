$(document).ready(function () {

	//===========Script added by Dustin McGilvray for Front-End Events===============

	// Webticker Function
	$("#webTicker").webTicker({
		height: '35px',
		duplicate: true,
		speed: 60
	});

	$("#webTicker-2").webTicker({
		height: '35px',
		duplicate: true,
		speed: 60
	});

	//Initialize all Materialize Components
	M.AutoInit();

	//===========AJAX CALL FOR FINANCIAL NEWS============================

	var queryURL =
		"https://newsapi.org/v2/top-headlines?sources=financial-times&apiKey=b6f739a31b20487fb0a56b712ec890b4";

	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function (response) {
		console.log(response.articles);

		//Variables to hold Responses
		var news1 = response.articles[0].title;
		var news2 = response.articles[1].title;
		var news3 = response.articles[2].title;
		var news4 = response.articles[3].title;
		var news5 = response.articles[4].title;
		var news6 = response.articles[5].title;
		var news7 = response.articles[6].title;
		var news8 = response.articles[7].title;
		var news9 = response.articles[8].title;
		var news10 = response.articles[9].title;

		//Adding News to Web Ticker
		$("#finNews1").html(news1 + " | ").attr('href', response.articles[0].url);
		$("#finNews2").html(news2 + " | ").attr('href', response.articles[1].url);
		$("#finNews3").html(news3 + " | ").attr('href', response.articles[2].url);
		$("#finNews4").html(news4 + " | ").attr('href', response.articles[3].url);
		$("#finNews5").html(news5 + " | ").attr('href', response.articles[4].url);
		$("#finNews6").html(news6 + " | ").attr('href', response.articles[5].url);
		$("#finNews7").html(news7 + " | ").attr('href', response.articles[6].url);
		$("#finNews8").html(news8 + " | ").attr('href', response.articles[7].url);
		$("#finNews9").html(news9 + " | ").attr('href', response.articles[8].url);
		$("#finNews10").html(news10 + " | ").attr('href', response.articles[9].url);

	});

	/*============ Search Bar ==========*/

	$('#search-form').on('submit', function (e) {
		e.preventDefault();
		var symbol = $('#search').val().trim();
		window.location.href = '/stock/' + symbol;
	});

	$('#search-icon').click(function () {
		$('#search-form').submit();
	});

	$('#search-close').click(function () {
		$('#search').val('');
	});

	/*=========== Stock Row Clicked ===========*/

	$(document).on('click', '.stock-row', function() {
		var symbol = $(this).data('symbol');
		if(symbol && symbol != '') {
			window.location.href = '/stock/' + symbol;
		}
	});
	
	/*=========== Sector Row Clicked ==========*/
	
	$(document).on('click', '.sector-row', function() {
		var sector = $(this).data('sector');
		if(sector && sector != '') {
			window.location.href = '/stocks/sector/' + sector;
		}
	});
	
	/*=========== Stock Purchased ============*/
	
	$('#purchase').click(() => {
		
		var timestamp = moment().format('YYYY-MM-DD hh:mm:ss');
		var data = {
			symbol: $('#symbol').data('symbol').toUpperCase(),
			name: $('#name').data('name'),
			date_purchased: timestamp,
			quantity: $('#shares').val().trim(),
			price: $('#price').data('price'),
			transaction_type: 'purchase',
			transaction_date: timestamp,
			asset_name: $('#name').data('name'),
		}
				
		data.quantity == '' ? 0 : data.quantity;
		
		console.log(data);
		$.post('/stock/buy/' + data.symbol, data, (res) => {
			console.log(res.message);
			$('#message-display').text(res.message);
			if(res.error) {
				$('#message-display').addClass('loss');
			} else {
				$('#message-display').removeClass('loss');
			}
// 			window.location.href = '/dashboard';
		});
	});
	
	/*=========== Stock Sold =============*/
	
	$('#sell').click(() => {
		
		var timestamp = moment().format('YYYY-MM-DD hh:mm:ss');
		var data = {
			symbol: $('#symbol').data('symbol').toUpperCase(),
			name: $('#name').data('name'),
			date_purchased: timestamp,
			quantity: $('#shares').val().trim(),
			price: $('#price').data('price'),
			transaction_type: 'sale',
			transaction_date: timestamp,
			asset_name: $('#name').data('name'),
		}
		
		data.quantity == '' ? 0 : data.quantity;
		
		console.log(data);
		$.post('/stock/sell/' + data.symbol, data, (res) => {
			console.log(res.message);
			$('#message-display').text(res.message);
// 			window.location.href = '/dashboard';
		});
	});
	
	$('.quantity-input').on('keyup', () => {
		var price = $('#price').data('price');
		var shares = $('.quantity-input').val();
		var cost = price * shares;
		console.log(price, shares, cost);
		$('#total').text(format(cost));
	});
	
	var format = (val=0, dec=2, den='$ ') => {
		var fixed = val.toFixed(dec);
		var parts = fixed.toString().split('.');
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return den + parts.join('.');
	}
	
	/*============== Add to Watchlist =============*/
	
	$('#add-watchlist').click(function() {
		var name = $('#card-name').data('name').trim();
		var symbol = $('#card-symbol').data('symbol').trim().toUpperCase();
		$.post('/watchlist/add/' + symbol, { name: name, symbol: symbol }, function(res) {
			console.log(res.message);
			$('#message-display').text(res.message);
			if(res.error) {
				$('#message-display').addClass('loss');
			} else {
				$('#message-display').removeClass('loss');
			}
		});
	});
	
	/*============== Remove From Watchlist ============*/
	
	$(document).on('click', '.wl-remove', function() {
		var symbol = $(this).data('symbol');
		$.post('/watchlist/remove/' + symbol, { symbol: symbol }, function(res) {
			location.reload();
		});
	});
	
	/*============== Stock Ticker =============*/
	
/*
		var ticker = $('#webTicker-2');
		ticker.empty();
		
		$.get('/stocks/api/movers', (movers) => {
			if(movers) {
				var spacer = $('<li>').addClass('ticker-spacer');
				movers.topGainers.
				Object.keys(movers.topGainers).forEach((key) => {

				  console.log(key, obj[key]);
				
				});
				var li = $('<li>').addClass('ticker-color');
				var last = $('<li>').addClass('last ticker-color');
				
				li.text(movers.topGainers.one.symbol + ' (' + movers.topGainers.one.percentChange + ')');
				last.text('----');
				
				ticker.append(spacer, li, last);
			}
		});
*/

	/////////////////////Code for the pie chart////////////////



	google.charts.load("current", { packages: ["corechart"] });
	google.charts.setOnLoadCallback(drawChart);
	function drawChart() {
		console.log('drawChart called...');
/*
		var data = google.visualization.arrayToDataTable([
			['Sector', 'Percentage'],
			['Technology', 330],
			['Energy', 240],
			['Finance', 180],
			['Capital Goods', 140],
			['Transportation', 110]
		]);
*/
/*
		var data = google.visualization.arrayToDataTable([
			['Sector', 'Percentage'],
			['Technology', 33],
			['Energy', 24],
			['Finance', 18],
			['Capital Goods', 14],
			['Transportation', 11]
		]);
*/

		$.get('/api/chart/sectors', function(sectors) {
			console.log(sectors);
			var testData = [
				['Sector', 'Percentage'],
				['Technology', 33],
				['Energy', 24],
				['Finance', 18],
				['Capital Goods', 14],
				['Transportation', 11]
			];
			console.log('-----');
			console.log(testData);
			var data = google.visualization.arrayToDataTable(sectors);
// 			var data = google.visualization.arrayToDataTable(sectors);
			var options = {
				title: 'Percentage of Sector',
				is3D: true,
				legend: { position: 'none' },
				backgroundColor: { fill:'transparent' },
				height: '475',
				titleTextStyle: {
					color: 'ghostwhite',
					fontName: "Sans-Serif",
					fontSize: 32
					
				},
				titlePosition: 'none'
			};
			var chart = new google.visualization.PieChart(document.getElementById('pie'));
			chart.draw(data, options);
		});
/*

		var data = google.visualization.arrayToDataTable([
			['Sector', 'Investment'],
			['Capital Goods', 3500],
			['Consumer Services', 24220],
			['Energy', 325],
			['Finance', 1060],
			['Health Care', 1070],
			['Miscellaneous', 2915],
			['Technology', 13830]
		]);
*/

/*
		var options = {
			title: 'Percentage of Sector',
			is3D: true,
			legend: { position: 'none' },
			backgroundColor: { fill:'transparent' },
			height: '475',
			titleTextStyle: {
				color: 'ghostwhite',
				fontName: "Sans-Serif",
				fontSize: 32
				
			},
			titlePosition: 'none'
		};

		var chart = new google.visualization.PieChart(document.getElementById('pie'));
		chart.draw(data, options);
*/
	}


	/////////////////AJAX CALLS TO API PAGES TO GET INFORMATIN FOR PLOTLY GRAPH//////////
	/////////////////Added by Julie Hodges<---////////////////////////
	
	function addSelected(selected) {
		var graphLinks =[$('#submitWeek'), $('#submitMonth'), $('#submitSix'), $('#submitYear'), $('#submitFive')];
		graphLinks.forEach(link => {
			if(selected == link) {
				link.addClass('graph-selected');
			} else {
				link.removeClass('graph-selected');
			}
		});
	}
	
	$("#submitMonth").on("click", function () {
		var symbol = $('#card-symbol').text().toUpperCase();
		$.get("/api/graph/oneMonth/" + symbol, function (data) {
			if (data) {
				var highestPrice = [];
				var dates = [];

				for (var i = 0; i < data.length; i++) {
					highestPrice.push(data[i].highestPrice);
					dates.push(data[i].date);

				}
				TESTER = document.getElementById('tester');

				var data = [
					{
						x: dates,
						y: highestPrice,
						type: 'line',
						name: "Highest Price over past month"
					}
				];
				Plotly.newPlot('tester', data);
			}
		})
	})

	$("#submitWeek").on("click", function () {
		var symbol = $('#card-symbol').text().toUpperCase();
		$.get("/api/graph/oneWeek/" + symbol, function (data) {
			if (data) {
				var highestPrice = [];
				var dates = [];

				for (var i = 0; i < data.length; i++) {
					highestPrice.push(data[i].highestPrice);
					dates.push(data[i].date);

				}
				TESTER = document.getElementById('tester');

				var data = [
					{
						x: dates,
						y: highestPrice,
						type: 'line',
						name: "Highest Price over past month"
					}
				];
				Plotly.newPlot('tester', data);
			}
		})
	})

	$("#submitSix").on("click", function () {
		var symbol = $('#card-symbol').text().toUpperCase();
		$.get("/api/graph/sixmonths/" + symbol, function (data) {
			if (data) {
				var highestPrice = [];
				var dates = [];

				for (var i = 0; i < data.length; i++) {
					highestPrice.push(data[i].highestPrice);
					dates.push(data[i].date);

				}
				TESTER = document.getElementById('tester');

				var data = [
					{
						x: dates,
						y: highestPrice,
						type: 'line',
						name: "Highest Price over past month"
					}
				];

				Plotly.newPlot('tester', data);
			}
		})
	})

	$("#submitYear").on("click", function () {
		var symbol = $('#card-symbol').text().toUpperCase();
		$.get("/api/graph/oneyear/" + symbol, function (data) {
			if (data) {
				var highestPrice = [];
				var dates = [];

				for (var i = 0; i < data.length; i++) {
					highestPrice.push(data[i].highestPrice);
					dates.push(data[i].date);

				}
				TESTER = document.getElementById('tester');

				var data = [
					{
						x: dates,
						y: highestPrice,
						type: 'line',
						name: "Highest Price over past month"
					}
				];

				Plotly.newPlot('tester', data);
			}
		})
	})

	$("#submitFive").on("click", function () {
		var symbol = $('#card-symbol').text().toUpperCase();
		$.get("/api/graph/fiveyear/" + symbol, function (data) {
			if (data) {
				var highestPrice = [];
				var dates = [];

				for (var i = 0; i < data.length; i++) {
					highestPrice.push(data[i].highestPrice);
					dates.push(data[i].date);

				}
				TESTER = document.getElementById('tester');

				var data = [
					{
						x: dates,
						y: highestPrice,
						type: 'line',
						name: "Highest Price over past month"
					}
				];

				Plotly.newPlot('tester', data);
			}
		})
	})


	//	
	$('#copyright-date').text(moment().format('YYYY'));
	
});	//End of document.ready
