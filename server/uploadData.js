var http = require('http');

var options = {
  host: 'localhost',
  port: 8080,
  path: '/students',
  method: 'POST',
};

// Make a post request for every object in the json file
var json = require('./alumnosIntercambio.json'); //(with path)
console.log(json[16]);
for (var i=0; i<json.length; i++){
  var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.write(JSON.stringify(json[i]));
  req.end();
}
