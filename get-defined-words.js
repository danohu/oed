jQuery(document).ready(function($) {
	var newLine = false;
	var line = '';
	var re= /<\S[^><]*>/g;
	
	$('span').each(function() {
		
		var trimmedText = $(this).text().trim();
		if ($(this).css('font-size') == '6px' && trimmedText.length > 1 && newLine) {
			console.log(trimmedText);
		} else {
			line = line + $(this).text().replace(re, "");
		}
		if ($('br', $(this)).length > 0) {
			newLine = true;
			line = '';
		} else {
			newLine = false;
		}
	});
})
