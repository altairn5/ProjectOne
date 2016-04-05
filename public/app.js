  // On page load

  $(document).ready(function(){
    pageLoad();
  });

  function pageLoad() {

           /* 1)Username Display Call
            2)Event Listeners
            On Prile Load Get Username For Profile Page*/


            $.get("/username", function(res){
                    
                    var username = res.username

                    var user = username.slice(0,1).toUpperCase()+username.slice(1).toLowerCase();
                    $("#welcome").append("<p>Welcome, "+user+"</p>");
                    
                    // Call City Fav fs
                    displayFavorites(res.city);

            });


            //New City Weather Event
            $("form").on("submit", function(e){
                  
                  e.preventDefault();

                  var cityName = $(this).serialize();
                  $(this).unbind(e);
                  getCityWeather(cityName);


            });


            // Dinamically Added #SaveCity Button needs triggers addCityToFavs fs
            $(document).on('click','#saveCity', function (){

                  addCityToFavs();

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

    var renderCity = `<p id="cityRender">${city}</p><p>${temp}`+'°F'+`</p><p>${sky}</p></p>`;
    
    var saveCityButton = "<button class='btn btn-default saveCity' id='saveCity'>Save City</button>";

    $('#div-city').append(renderCity+saveCityButton);

  });

}

function addCityToFavs(){

        var newFavCity= $('#cityRender').text();
        console.log(newFavCity);

        $('#div-city').children('p').remove();


        $.ajax({
          method:'POST',
          url:'/city',
          data: {city: newFavCity},
          success: function(data){
            //Iteration FS 
          displayFavorites(data); 
          $('#saveCity').remove(); 
          }
         
        })

}

function displayFavorites(citiesArray){

    $.each(citiesArray,function(index, city){

            $('.favList').append(`<option>${city}</option>`);

            })
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
