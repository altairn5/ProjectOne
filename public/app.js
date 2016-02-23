  // On page load
  var apiKey = "ab0dc76da6bb6b1544448615fa4b00b1";
  $(function() {
    pageLoad();
  });

  // function definitions

  function pageLoad() {
  // load city
  // getWeather();
  // set event listeners

  // Get Username For Profile Page
  $.get("/username", function(res){
    console.log(res);
    var username = res
    var user = username.slice(0,1).toUpperCase()+username.slice(1).toLowerCase();
    $("#welcome").append("<p>Welcome, "+user+"</p>");
  });
  $("form").on("submit", function(e){
    e.preventDefault();
    // var formData= $(this);
    var cityName = $(this).serialize();
    $("#search").val(" ");

    console.log("the city name is: " + cityName);

  // tHERE ALSO WAYS TO NOT USE SERIALIZE()
  $.get("/city", cityName, function(res){
    
    console.log(res);
    var city = res.name;
    console.log(city);
    var temp = Math.floor((res.main.temp - 273.15) * 1.8 + 32);
    console.log(temp);
    var sky = res.weather[0].main;
    $('#div-city').empty();

    $('#div-city').append('<p><h1>'+city+'</p>'+'<p>'+temp+'°F</p><p>'+sky+'</p></h1></p>');

  // var cityWeather = city+temp;
  // renderWeather(cityWeather);
  });
  // .done(function(response){
  //   console.log(response);
  //   // append new city to the page
  //   // getWeather();
  //   // $("#new-city-form")[0].reset();
  //   renderWeather(response.data);
  // });
  });
  };


  // function renderWeather(city) {
  //  var template = _.template($("#city-template").html());
  //   // input city into template and append to parent
  //   console.log(template);
  //   var weatherItems = city.map(function(city) {
  //     return template(city);
  //   // clear content (for repeated use)
  //   $("#div-city").html("");
  //   // $("#div-temp").html("");
  //   // append city to div
  //   $("#div-city").append(weatherItems);
  //   // $("#div-temp").append(temp);
  // });

  // function deleteWeather(context) {
  //   var weatherId = $(context).data()._id;
  //   $.ajax({
  //     url: '/results/' + weatherId,
  //     type: 'DELETE',
  //     success: function(res) {
  //       // once successfull, re-render all city
  //       getWeather();
  //     }
  //   });
  // }
