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
  
        // Clear Value in Search Field
        $("#search").val(" ");

        /*THERE ALSO WAYS TO NOT USE SERIALIZE()
         Success Functions Below*/
        $.get("/city", city, function(res){

            var city = res.name;
           
            var temp = Math.floor((res.main.temp - 273.15) * 1.8 + 32);
         
            var sky = res.weather[0].main;
            $('#div-city').empty();

            var renderCity = `<p id="cityRender">${city}</p><p>${temp}`+'°F'+`</p><p>${sky}</p></p>`;

            var saveCityButton = "<button class='btn btn-default saveCity' id='saveCity'>Save City</button>";

            $('#div-city').append(renderCity+saveCityButton);

        });
    // End getCityWeather fs
    }

    // Add New City to Favs FS
    function addCityToFavs(){

          var newFavCity= $('#cityRender').text();
          console.log(newFavCity);

          // Removes City Info as it Gets Added to Favs
          $('#div-city').children('p').remove();

          // Ajax call 
          $.ajax({
              method:'POST',
              url:'/city',
              data: {city: newFavCity},
              success: function(data){

                          //City Array Displayed with fs
                          displayFavorites(data); 
                          $('#saveCity').remove(); 

              // End Success fs
              }
          // End Ajax Call
          })
    // End Add New City to Favs fs
    }


    function displayFavorites(citiesArray){

        // Iterates Through City Array and Display Them 
        $.each(citiesArray,function(index, city){

                $('.favList').append(`<option>${city}</option>`);

                })
    // End of fs
    }





