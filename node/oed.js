var app = require('express').createServer();
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var jsentries = require('./jsentries').jsentries;

var png_for_page = function(req, res){

	var page = req.param('page', '250');
	var vol = req.param('vol', '6');
	var format = req.param('format', 'png');
	var djvuoptions =['-page=' + page, '-format=ppm', '/var/www/oed/oedvol' + vol + '.djvu'];
  var ddjvu = spawn('ddjvu',  djvuoptions);
	
	var convert = spawn('convert', ['-', format + ':-']);
	res.contentType('image/png');
	
	ddjvu.stdout.on('data', function(data){
									convert.stdin.write(data);
									});
	convert.stdout.on('data', function(data){
										res.write(data, 'binary');
										});
	convert.on('exit', function(code){
						 res.end()
						 });

	ddjvu.on('exit', function(code){
						 convert.stdin.end();
						 });
};
var djvu_for_page = function(req, res){
	//not yet implemented -- use /page/png or ohuiginn.net/oed
	}

var text_for_page = function(req, res){
	res.contentType('text/html');
	var page = req.param('page', '250');
	var vol = req.param('vol', '6');
	var format = req.param('format', 'png');
	var djvuoptions =['-page=' + page, '/var/www/oed/oedvol' + vol + '.djvu'];
  var djvutxt = spawn('djvutxt',  djvuoptions);
	djvutxt.stdout.on('data', function(data){
									res.write(data);
									});
	djvutxt.on('exit', function(code){
						 res.end();
						 });
};

var xml_for_page = function(req, res){
	//NON-FUNCTIONAL: this times out before returning anything useful
	res.contentType('text/xml');
	var page = req.param('page', '250');
	var vol = req.param('vol', '6');
	var format = req.param('format', 'png');
	var djvuoptions =['-page=' + page, '/var/www/oed/oedvol' + vol + '.djvu'];
	console.log(djvuoptions);
  var djvuxml = spawn('djvuxml',  djvuoptions);
	djvuxml.stdout.on('data', function(data){
									res.write(data);
									});
	djvuxml.on('exit', function(code){
						 res.end();
						 });
};

app.get('/', function(req, res){
				res.send('Nothing here. Try /page/png?vol=2&page=240');
				});
app.get('/page/png', png_for_page);
app.get('/page/djvu', djvu_for_page);
app.get('/page/text', text_for_page);
app.get('/page/xml', xml_for_page);
app.get('/jquery', jsentries);
app.listen(8082);

