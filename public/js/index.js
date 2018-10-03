// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
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

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getExamples().then(function(data) {
    var $examples = data.map(function(example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function() {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);

//===========Script added by Dustin McGilvray for Front-End Events===============
$(document).ready(function() {
  
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


});
