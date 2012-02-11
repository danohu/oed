var app = require('express').createServer();
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var fs = require('fs');

var jpeg_spawn = function(req, res){

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
										console.log('writing binary');
										res.write(data, 'binary');
										});
	convert.on('exit', function(code){
						 res.end()
						 });

	ddjvu.on('exit', function(code){
						 convert.stdin.end();
						 });
};

app.get('/', function(req, res){
				res.send('OK');
				});

app.get('/page/png', png_for_page);
app.listen(8082);

