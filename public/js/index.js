//===========Script added by Dustin McGilvray for Front-End Events===============
$(document).ready(function() {
	
//===========Script added by Dustin McGilvray for Front-End Events===============

	// Webticker Function
	$("#webTicker").webTicker({
	  height:'35px',
	  duplicate: true,
	  speed: 60
	});
	
	$("#webTicker-2").webTicker({
	  height:'35px',
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
	}).then(function(response) {
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
	  $("#finNews1").html(news1 + " | ");
	  $("#finNews2").html(news2 + " | ");
	  $("#finNews3").html(news3 + " | ");
	  $("#finNews4").html(news4 + " | ");
	  $("#finNews5").html(news5 + " | ");
	  $("#finNews6").html(news6 + " | ");
	  $("#finNews7").html(news7 + " | ");
	  $("#finNews8").html(news8 + " | ");
	  $("#finNews9").html(news9 + " | ");
	  $("#finNews10").html(news10 + " | ");
	
	});

/*============ Search Bar ==========*/

	$('#search-form').on('submit', function(e) {
		e.preventDefault();
		var symbol = $('#search').val().trim();
		window.location.href = '/stock/' + symbol;
	});
	
	var API = {
		getStock: function(symbol) {
			return $.ajax({
				
			});
		}
	}
	
/*
	var API = {
		saveExample: function(example) {
			return $.ajax({
				headers: {
					"Content-Type": "application/json"
				},
				type: "POST",
				url: "api/examples",
				data: JSON.stringify(example)
			});
		},
		getExamples: function() {
			return $.ajax({
				url: "api/examples",
				type: "GET"
			});
		},
		deleteExample: function(id) {
			return $.ajax({
				url: "api/examples/" + id,
				type: "DELETE"
			});
		}
	};
*/
	
});
var queryURL =
  "https://newsapi.org/v2/top-headlines?sources=financial-times&apiKey=b6f739a31b20487fb0a56b712ec890b4";

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
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
  $("#finNews1").html(news1 + " | ");
  $("#finNews2").html(news2 + " | ");
  $("#finNews3").html(news3 + " | ");
  $("#finNews4").html(news4 + " | ");
  $("#finNews5").html(news5 + " | ");
  $("#finNews6").html(news6 + " | ");
  $("#finNews7").html(news7 + " | ");
  $("#finNews8").html(news8 + " | ");
  $("#finNews9").html(news9 + " | ");
  $("#finNews10").html(news10 + " | ");

});


});
