var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



    var CitySchema = new Schema({
    	cityName: String,
       	weather: String
    })

var City = mongoose.model("City", CitySchema);



module.exports = City;

