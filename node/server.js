var http = require('http');
var url = require('url');
var spawn = require('child_process').spawn




var jpeg_for_page = function(request, response){
			response.writeHead(200, {"Content-Type":"text/plain"});
			response.write('OED: jpeg page');
			response.end();
};

var static_page = function(request, response){
			response.writeHead(200, {"Content-Type":"text/plain"});
			response.write('OED: static page');
			response.end();
};

var error = function(statuscode, pathname, request, response){
			response.writeHead(statuscode, {"Content-Type":"text/plain"});
			response.write('Error ' + statuscode + 'on path ' + pathname);
			response.end();
};

var routes = {
	'/page' : jpeg_for_page,
	'/static' : static_page
}

var router = function(request, response){
  var pathname = url.parse(request.url).pathname;
	if (typeof routes[pathname] === 'function'){
		routes[pathname](request, response);
	}
	else{
		error(404, pathname, request, response);
	}
}
var start = function(){
	var onRequest = function(request, response){
		  router(request, response);
			};
	http.createServer(onRequest).listen(8082);
	console.log('server started');
	};

exports.start = start

