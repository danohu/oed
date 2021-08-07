var jsdom = require('jsdom');
var fs = require('fs');


var jsentries = function(req, res){
	res.contentType('text/html');
	fs.readFile('../example-page.html', function(err, htmldata){
		console.log('done readfile');
		if(err){
			console.log(err);
		}
		
	jsdom.env({
		html: htmldata,
		scripts: [
		'http://code.jquery.com/jquery-1.5.min.js'
		]
		}, function (err, window) {
		  var results = [];
		  console.log('in jquery env');
			var $ = window.jQuery;
			//$(document).ready(function($) {
	var newLine = false;
	var line = '';
	var re= /<\S[^><]*>/g;
	var headword = '[from previous page]';
	
	$('span').each(function() {
		var trimmedText = $(this).text().trim();
		if ($(this).css('font-size') == '6px' && trimmedText.length > 1 && newLine) {
		  console.log('found headword ' + headword );
		  results[headword] = line;
		  headword = trimmedText;
			line = '';
		} else {
			line = line + $(this).text().replace(re, "");
		}
		if ($('br', $(this)).length > 0) {
			newLine = true;
		} else {
			newLine = false;
		}
		});
	res.write('Found entries from page');
	//XXX: do something with these results
	res.end();

		
		});
	});

};

exports.jsentries = jsentries;
