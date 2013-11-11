

// The host values must be hostnames (without protocol or trailing slashs)
// The mobile objects are comprised of type (qs for querystring or d for subdomain) and are arranged similar to Sams, mobile theme plugin
// for querystring use the entire string which would be used for mobile (eg 'v=m'), for subdomain use the subdomain without trailing dots (eg 'mobile')
var HOSTS = [
	{
		'ID' : 'development',
		'hostname' : 'fill.me.in.com',
		'mobile_type' : 'qs',
		'mobile_val' ; 'v=m'
	},{
		'ID' : 'staging',
		'hostname' : 'fill.me.in.com',
		'mobile_type' : 'd',
		'mobile_val' ; 'm'
	}
];

var current_host = window.location.hostname;

// I don't want to answer a dialog on every switch, so always just switch to the next item (or the first item from last)
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
		if (toHost.mobile_type == 'qs') { // TODO : fix double adding the querystring
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
