var http = require("http");

var storage = {
  "alumnos" : [],

  universityCoordinates :
    [
      {"universidad":"UTCP- PRAGA", "coordinates":[14.392722, 50.103064]},
      {"universidad":"UPC-ETSEIB", "coordinates":[2.118411, 41.384679]},
      {"universidad":"UPC-EUETIB", "coordinates":[2.149232, 41.388715]},
      {"universidad":"UPC-FIB", "coordinates":[2.114160, 41.389317]},
      {"universidad":"USP (SAN PABLO)", "coordinates": [-46.730918, -23.561399]},
      {"universidad":"EC PARIS", "coordinates": [2.291261, 48.765412]},
      {"universidad":"INSA LYON", "coordinates": [4.878407, 45.783239]},
      {"universidad":"TELECOM BRETAGNE", "coordinates": [-4.570119, 48.358787]},
      {"universidad":"U BOLONIA", "coordinates": [11.354050, 44.496224]},
      {"universidad":"UE - GENOVA", "coordinates": [8.930651, 44.414873]},
      {"universidad":"UP MADRID", "coordinates": [-3.719441, 40.448662]},
      {"universidad":"UPV", "coordinates": [-0.341697, 39.480927]},
    ],

  getStudents : function(){
    var studentNames = [];
    for (var i=0; i < this.alumnos.length; i++){
      studentNames.push(this.alumnos[i].properties.title);
    }
    return studentNames;
  },

  getStudent : function(id){
    for (var i=0; i < this.alumnos.length; i++){
      if (this.alumnos[i].properties.id == id)
        return this.alumnos[i];
    }
    return null;
  },

  getCoordinates : function(universidad){
    for(var i=0; i<this.universityCoordinates.length; i++){
      if(this.universityCoordinates[i].universidad == universidad)
        return this.universityCoordinates[i].coordinates;
    }
  },

  addStudent : function(newStudent){
    this.alumnos.push(newStudent);
  },

  lastId : 0,

  getId : function(){
    return ++this.lastId;
  },

  getGeoJSON : function(){
    return this.alumnos;
  }
};


function processRequest(host, uri, method, data){

    if(uri.match("/geojson$")){
      if(method == "GET")
        return {
          status: "200",
          data: JSON.stringify(storage.getGeoJSON()),
          headers:{
            "Access-Control-Allow-Origin": "*",
          }
        }
    }

    if(uri.match("/students$")){
    	if (method == "GET")
    		// return the geoJSON representation of the students
    		return{
    			status: "200",
          data: JSON.stringify(storage.getStudents()),
          headers: {
            "Access-Control-Allow-Origin": "*",
            Link: "http://" + host + "/students", rel: 'self',
          }
        }

      else if( method == "POST") {
        data = JSON.parse(data);
        var studentId = storage.getId();
        var coordinates = storage.getCoordinates(data.universidad);
        var carrera = String(data.carrera);
        var newStudent = {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": coordinates
          },
          "properties": {
            "title": data.title,
            "id": studentId,
            "description": data.description,
            "ciudad": data.ciudad,
            "universidad": data.universidad,
            "marker-color": "#0044FF",
            "marker-symbol": "college"
          }
        };
        newStudent.properties[carrera] = true;
        storage.addStudent(newStudent);
        return{
          status: "204",
          headers: { Location: "http://" + host + "/students/" + studentId}
        }
      }
      else
          return {
              status: "405", // method not allowed
              headers : { "Allow" : "GET, POST" }
          };
    }

    else if (id = uri.match("/students/([0-9]+)$")){
      if (method == "GET"){
        var student = JSON.stringify(storage.getStudent(id[1]));
        if (student == "null")
          return{
            status: "404"
          }
        else
          return{
      			status: "200",
            data: student,
            headers: { Link: "http://" + host + "/students/" + id[1], rel: 'self' }
          }
      }
      else
        return {
            status: "405", // method not allowed
            headers : { "Allow" : "GET" }
        };
    }

    else
    	return {status: "404"}; // Not found
}

http.createServer(function(request, response) {

    request.on('error', function(err) {
        console.error(err);
        response.statusCode = 400;
        response.end();
    });

    response.on('error', function(err) {
        console.error(err);
    });

    // init the body to get the data asynchronously
    request.body = "";

    // get the data of the body
    request.on('data', function (chunk) {
        request.body += chunk;
    });

    request.on('end', function () {
        // process the request
        var result = processRequest(request.headers.host, request.url, request.method, request.body);

        // send back the result
        response.writeHead(result.status ? result.status : "200", result.headers ? result.headers : {});
        response.end(result.data ? result.data : null);
    })
}).listen(8080);
