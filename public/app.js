  // On page load

  $(document).ready(function() {
    pageLoad();
  });

 

  function pageLoad() {

    //1)Username Display Call
    //2)Event Listeners
 
  // On Prile Load Get Username For Profile Page

    $.get("/username", function(res){
          // console.log(res);
          var username = res
          var user = username.slice(0,1).toUpperCase()+username.slice(1).toLowerCase();
          $("#welcome").append("<p>Welcome, "+user+"</p>");
    });


      //City Weather Request Form
      $("form").on("submit", function(e){
        e.preventDefault();

        var cityName = $(this).serialize();
        getCityWeather(cityName);
      
      });


      // Save City Event Listener and FS

      $("#saveCity").on("click", function (){


      })


// End Pageload Fs
  };



// Function Get Weather For Submmitted City Name
  function getCityWeather (city){
    

    
    $("#search").val(" ");

    console.log("the city name is: " + city);

  // tHERE ALSO WAYS TO NOT USE SERIALIZE()
  $.get("/city", city, function(res){
    
    console.log(res);
    var city = res.name;
    console.log(city);
    var temp = Math.floor((res.main.temp - 273.15) * 1.8 + 32);
    console.log(temp);
    var sky = res.weather[0].main;
    $('#div-city').empty();

    // $('#div-city').append('<p><h1>'+city+'</p>'+'<p>'+temp+'°F</p><p>'+sky+'</p></h1></p>');

    var renderCity = `<p id="cityName">${city}</p><p>${temp}`+'°F'+`</p><p>${sky}</p></p>`;
    
    var saveCityButton = "<button id ='saveCity'>"+"Save City"+"</button>";

    $('#div-city').append(renderCity+saveCityButton);

  });

}



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
