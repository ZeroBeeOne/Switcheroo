var THEBOOKMARKLET = function(){/*
var HOSTS = [];

var current_host = window.location.hostname;

var redirected = false;
$.each(HOSTS, function(i,el){
	var next;
	if (current_host.search(el.hostname) != -1) {
		if (i == HOSTS.length-1) {
			next = 0;
		} else {
			next = ++i;
		}
		redirect(HOSTS[i], HOSTS[next]);
		redirected = true;
		return false;
	}
});

if (!redirected) {
	console.log('I appear to be lost...');
}

function checkForMobile(host) {
	switch (host.mobile_type) {
		case 'qs':
			return getQueryString(host.mobile_val);
			break;
		case 'd':
			return (current_host == host.mobile_val + '.' + host.hostname);
			break;
	}
	return false;
}

function getQueryString(qs) {
	var url = window.location.href;
	return (url.indexOf('?' + qs) != -1 || url.indexOf('&' + qs) != -1 );
}

function redirect(fromHost,toHost) {
	var gotoUrl = window.location.protocol + '//',
		path = window.location.href.replace(gotoUrl + window.location.host,'');
	if (checkForMobile(fromHost)) {
		if (toHost.mobile_type == 'd') {
			// use the subdomain
			gotoUrl += toHost.mobile_val + '.';
		}
		gotoUrl += toHost.hostname;
		gotoUrl += path;
		if (toHost.mobile_type == 'qs') {
			if (gotoUrl.indexOf('?') == -1) {
				gotoUrl += '?' + toHost.mobile_val;
			} else {
				gotoUrl += '&' + toHost.mobile_val;
			}
		}
	} else {
		gotoUrl += toHost.hostname;
		gotoUrl += path;
	}
	console.log("redirecting to " + gotoUrl + " (" + fromHost.ID + " -> " + toHost.ID + " )");
	window.location.href = gotoUrl;
}
*/}.toString().slice(14,-3);

window.hostSwitcherGenerator = {};

window.hostSwitcherGenerator.root = document.createElement('div');
window.hostSwitcherGenerator.root.setAttribute('id', 'hostSwitcherGenerator');
document.getElementsByTagName('body')[0].appendChild(window.hostSwitcherGenerator.root);

if (!window.jQuery) {
	includeJQ();
} else {
	init();
}

function init() {
	(function($) {
		$('style:not([disabled]), link[rel=stylesheet]:not([disabled])').attr('data-disabled-by-hostSwitcher', true).disable();
		var css = '#hostSwitcherGenerator{position:fixed;top:10%;right:10%;width:80%;height:80%;background-color:#fff;z-index:9001;overflow:hidden;font-family:arial,sans-serif;-webkit-border-radius:8px;-moz-border-radius:8px;border-radius:8px}#hostSwitcherGenerator h1{font-size:18px;color:#000;display:block;text-align:center;padding-top:10px}#hostSwitcherGenerator ul{list-style:none;margin:0;padding:10px;max-height:60%;overflow-y:auto}#hostSwitcherGenerator ul li{position:relative;border-bottom:1px solid #000;margin:8px 0}#hostSwitcherGenerator ul li input{-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;padding:2px;margin-bottom:4px;width:80%;height:20px}#hostSwitcherGenerator ul li input[name=host_mobile_value]{width:40%}#hostSwitcherGenerator ul li select{width:35%;margin-right:5%;height:20px}#hostSwitcherGenerator ul li button{width:60px;height:60px;position:absolute;top:18px;right:5%}';
		$('#hostSwitcherGenerator').append('<style type="text/css">' + css + '</style>');
		$('<h1>Host switcher generator</h1>').appendTo('#hostSwitcherGenerator');
		$('<ul></ul>').appendTo('#hostSwitcherGenerator');
		$('<a href="#" class="invalid">The bookmarklet</a>').appendTo('#hostSwitcherGenerator');
		$('<button>X</button>').appendTo('#hostSwitcherGenerator');

		$item = $('<li><input placeholder="Host ID" name="host_ID" type="text" /><br /><input placeholder="Hostname" name="hostname" type="text" /><br /><select name="host_mobile_type"><option value="">Mobile Site Identifier...</option><option value="qs">QueryString</option><option value="d">Domain</option></select><input placeholder="Mobile Site Value" name="host_mobile_value" /><button>+</button></li>');
		$item.appendTo('#hostSwitcherGenerator ul');


		$('#hostSwitcherGenerator').on('click','ul li button',function(){
			$item.clone().appendTo('#hostSwitcherGenerator ul');
		});
		$('#hostSwitcherGenerator > button').on('click',destroy);

		function destroy() { // TODO should I perhaps be doing this on clickoutside too?
			$('#hostSwitcherGenerator').remove();
			$('style[data-disabled-by-hostSwitcher], link[rel=stylesheet][data-disabled-by-hostSwitcher]').enable().removeAttr('data-disabled-by-hostSwitcher');
		}
		function refreshBookmarklet(event) {
			var HOSTS = [], bmString;

			$('#hostSwitcherGenerator ul li').each(function(i,el){
				var thisRow = {};
				thisRow.ID = $('[name=host_ID]', el).val();
				thisRow.hostname = $('[name=hostname]', el).val();
				thisRow.mobile_type = $('[name=host_mobile_type]', el).val();
				thisRow.mobile_val = $('[name=host_mobile_value]', el).val();
				// TODO : some validation could go here to make sure the values have been entered, and are sane, but what am I gonna do, injection attack myself?
				HOSTS.push(thisRow);
			});
			bmString = THEBOOKMARKLET.replace("var HOSTS = [];", "var HOSTS = " + JSON.stringify(HOSTS) + ";");
			bmString = bookmarkletify(bmString);
			$('#hostSwitcherGenerator > a').attr("href",bmString);
			event.preventDefault();
		}

	})(jQuery);
}



function includeJQ() {
	getScript('http://code.jquery.com/jquery.min.js', function() {
		if (typeof jQuery=='undefined') {
			console.log("Couldn't load jQuery - giving up!");
			// should do some cleanup here...
		} else {
			$.noConflict();
			init();
		}
	});
}






// HELPER FUNCTIONS
// Pretty much stolen as is from http://www.learningjquery.com/2009/04/better-stronger-safer-jquerify-bookmarklet/
function getScript(url,success){
	var script=document.createElement('script');
	script.src=url;
	var target=window.hostSwitcherGenerator.root,
	done=false;
	// Attach handlers for all browsers
	script.onload=script.onreadystatechange = function(){
		if ( !done && (!this.readyState
		|| this.readyState == 'loaded'
		|| this.readyState == 'complete') ) {
			done=true;
			success();
			script.onload = script.onreadystatechange = null;
		}
	};
	target.appendChild(script);
}

//These function were taken and modified slightly from http://ted.mielczarek.org/code/mozilla/bookmarklet.html, which originally modified them from brainjar.com . Ain't sharing grand?
function bookmarkletify(input) {

	var literalStrings;  // For temporary storage of literal strings.

	var output, i;

	// Get input script code, process it and display output.

	output = "(function() {\n" + input + "\n})();";

	output = replaceLiteralStrings(output);

	output = removeComments(output);

	output = compressWhiteSpace(output);

	output = combineLiteralStrings(output);

	output = restoreLiteralStrings(output);

	// make the link
	output = "javascript:" + output;

	return output;

	function replaceLiteralStrings(s) {

		var i, c, t, lines, escaped, quoteChar, inQuote, literal;

		literalStrings = new Array();
		t = "";

		// Split script into individual lines.

		lines = s.split("\n");
		for (i = 0; i < lines.length; i++) {

		j = 0;
		inQuote = false;
		while (j <= lines[i].length) {
			c = lines[i].charAt(j);

			// If not already in a string, look for the start of one.

			if (!inQuote) {
			if (c == '"' || c == "'") {
				inQuote = true;
				escaped = false;
				quoteChar = c;
				literal = c;
			}
			else
				t += c;
			}

			// Already in a string, look for end and copy characters.

			else {
				if (c == quoteChar && !escaped) {
					inQuote = false;
					literal += quoteChar;
					t += "__" + literalStrings.length + "__";
					literalStrings[literalStrings.length] = literal;
				}
				else if (c == "\\" && !escaped) {
					escaped = true;
				}
				else {
					escaped = false;
				}
				literal += c;
			}
			j++;
		}
		t += "\n";
		}

		return t;
	}

	function removeComments(s) {

		var lines, i, t;

		// Remove '//' comments from each line.

		lines = s.split("\n");
		t = "";
		for (i = 0; i < lines.length; i++)
		t += lines[i].replace(/([^\x2f]*)\x2f\x2f.*$/, "$1");

		// Replace newline characters with spaces.

		t = t.replace(/(.*)\n(.*)/g, "$1 $2");

		// Remove '/* ... */' comments.

		lines = t.split("*/");
		t = "";
		for (i = 0; i < lines.length; i++)
		t += lines[i].replace(/(.*)\x2f\x2a(.*)$/g, "$1 ");

		return t;
	}

	function compressWhiteSpace(s) {

		// Condense white space.

		s = s.replace(/\s+/g, " ");
		s = s.replace(/^\s(.*)/, "$1");
		s = s.replace(/(.*)\s$/, "$1");

		// Remove uneccessary white space around operators, braces and parentices.

		s = s.replace(/\s([\x21\x25\x26\x28\x29\x2a\x2b\x2c\x2d\x2f\x3a\x3b\x3c\x3d\x3e\x3f\x5b\x5d\x5c\x7b\x7c\x7d\x7e])/g, "$1");
		s = s.replace(/([\x21\x25\x26\x28\x29\x2a\x2b\x2c\x2d\x2f\x3a\x3b\x3c\x3d\x3e\x3f\x5b\x5d\x5c\x7b\x7c\x7d\x7e])\s/g, "$1");
		return s;
	}

	function combineLiteralStrings(s) {

		var i;

		s = s.replace(/"\+"/g, "");
		s = s.replace(/'\+'/g, "");

		return s;
	}

	function restoreLiteralStrings(s) {

		var i;

		for (i = 0; i < literalStrings.length; i++) {
			s = s.replace(new RegExp("__" + i + "__"), literalStrings[i]);
		}

		return s;
	}
}
