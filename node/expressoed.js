var app = require('express').createServer();
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var fs = require('fs');

var jpeg_spawn = function(req, res){
	var put_output = function(error, stdout, stderr){
		res.contentType('image/png');
		//res.sendfile('/tmp/somepage.png');
		//console.log(stdout);
		res.send(stdout);
		res.end();
	}

	var page = req.param('page', '250');
	var vol = req.param('vol', '6');
	var format = req.param('format', 'png');
  var ddjvu = spawn('ddjvu',  ['-page=' + page, '-format=ppm', '/var/www/oed/oedvol2.djvu']);
	var convert = spawn('convert', ['-', format + ':-']);
	var output_file = fs.createWriteStream('/tmp/indirect.png', {encoding: 'binary'});
	
	ddjvu.stdout.on('data', function(data){
									convert.stdin.write(data);
									});
	convert.stdout.on('data', function(data){
										output_file.write(data)});
	convert.on('exit', function(code){
						 output_file.end();
						 console.log('written 2nd part of /tmp/indirect.png');
						 res.end()
						 });

	ddjvu.on('exit', function(code){
						 convert.stdin.end();
						 console.log('written 1st part of /tmp/indirect.png');
						 });


	/*var options = {
		'encoding' : 'binary',
		'maxBuffer' : 10 * 1024 * 1024,
	}
	console.log(cmdline, options);
	exec(cmdline, put_output);*/
	//res.send('jpeg for page ' + page + ', vol ' + vol);
};


var jpeg_for_page_binary = function(req, res){
	var put_output = function(error, stdout, stderr){
		res.contentType('image/png');
		//res.sendfile('/tmp/somepage.png');
		//console.log(stdout);
		res.send(stdout);
		res.end();
	}

	var write_file = function(error, stdout, stderr){
		fs.writeFileSync('/tmp/pngout.png', stdout);
		res.send('written');
		res.end();
	}

	var page = req.param('page', '250');
	var vol = req.param('vol', '6');
	var format = req.param('format', 'png');
	var cmdline = 'ddjvu -page=' + page + ' -format=ppm /var/www/oed/oedvol2.djvu | convert - "' + format + ':/tmp/direct.png"';
	var options = {
		'encoding' : 'binary',
		'maxBuffer' : 10 * 1024 * 1024,
	}
	console.log(cmdline, options);
	//exec(cmdline, put_output);
	exec(cmdline, write_file);
	//res.send('jpeg for page ' + page + ', vol ' + vol);
};

var jpeg_for_page = function(req, res){
	var put_output = function(error, stdout, stderr){
		res.contentType('image/png');
		//res.sendfile('/tmp/somepage.png');
		//console.log(stdout);
		res.send(stdout);
		res.end();
	}

	var page = req.param('page', '250');
	var vol = req.param('vol', '6');
	var format = req.param('format', 'png');
	var cmdline = 'ddjvu -page=' + page + ' -format=ppm /var/www/oed/oedvol2.djvu | convert - "' + format + ':-"';
	var options = {
		'encoding' : 'binary',
		'maxBuffer' : 10 * 1024 * 1024,
	}
	console.log(cmdline, options);
	exec(cmdline, put_output);
	//res.send('jpeg for page ' + page + ', vol ' + vol);
};


app.get('/', function(req, res){
				res.send('goodby, cruel world');
				});

app.get('/jpeg', jpeg_for_page_binary);
app.get('/spawn', jpeg_spawn);

app.listen(8082);

