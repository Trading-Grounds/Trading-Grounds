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

	$(document).on('click', '.stock-row', function () {
		var symbol = $(this).data('symbol');
		if(symbol && symbol != '') {
			window.location.href = '/stock/' + symbol;
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
			price: $('#purchase').data('price'),
			transaction_type: 'purchase',
			transaction_date: timestamp,
			asset_name: $('#name').data('name'),
		}
				
		data.quantity == '' ? 0 : data.quantity;
		
		console.log(data);
		$.post('/stock/buy/' + data.symbol, data, (res) => {
			console.log(res.message);
			window.location.href = '/dashboard';
		});
	});
	
	$('#shares').on('keyup', () => {
		var price = $('#purchase').data('price');
		var shares = $('#shares').val();
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

	/////////////////////Code for the pie chart////////////////



	google.charts.load("current", { packages: ["corechart"] });
	google.charts.setOnLoadCallback(drawChart);
	function drawChart() {
		var data = google.visualization.arrayToDataTable([
			['Sector', 'Percentage'],
			['Technology', 33],
			['Energy', 24],
			['Finance', 18],
			['Capital Goods', 14],
			['Transportation', 11]
		]);

		var options = {
			title: 'Percentage of Sector',
			is3D: true,
		};

		var chart = new google.visualization.PieChart(document.getElementById('pie'));
		chart.draw(data, options);
	}


	/////////////////AJAX CALLS TO API PAGES TO GET INFORMATIN FOR PLOTLY GRAPH//////////
	/////////////////Added by Julie Hodges<---////////////////////////
	$("#submitMonth").on("click", function () {
		$.get("/api/graph", function (data) {
			if (data) {
				var highestPrice = [];
				var dates = [];

				for (var i = 0; i < data.length; i++) {
					highestPriceW.push(data[i].highestPrice);
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
		$.get("/api/graph/oneWeek", function (data) {
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
		$.get("/api/graph/sixmonths", function (data) {
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
		$.get("/api/graph/oneyear", function (data) {
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
		$.get("/api/graph/fiveyear", function (data) {
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

});	//End of document.ready
