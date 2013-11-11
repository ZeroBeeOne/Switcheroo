// The host values must be hostnames (without protocol or trailing slashs)
// The mobile objects are comprised of type (qs for querystring or d for subdomain) and are arranged similar to Sams, mobile theme plugin
// for querystring use the entire string which would be used for mobile (eg 'v=m'), for subdomain use the subdomain without trailing dots (eg 'mobile')
var DEV_HOST = 'fill.me.in.com',
	STAGING_HOST = 'fill.me.in.com',
	LIVE_HOST = 'fill.me.in.com',
	DEV_MOBILE = {
		'type' : 'qs',
		'value' : 'v=m'
	},
	STAGING_MOBILE = {
		'type' : 'qs',
		'value' : 'v=m'
	},
	LIVE_MOBILE = {
		'type' : 'd',
		'value' : 'm'
	};


var current_host = window.location.hostname;

// I don't want to answer a dialog on every switch, so just do dev->staging->live->dev

// are we on the live site?
if (LIVE_HOST && current_host.search(LIVE_HOST) != -1) {
	// Then redirect to dev
	redirect(LIVE_HOST,LIVE_MOBILE,DEV_HOST,DEV_MOBILE);

} else if (DEV_HOST && current_host.search(DEV_HOST) != -1) {// Or the dev site?
	// then redirect to staging
	redirect(DEV_HOST,DEV_MOBILE,STAGING_HOST,STAGING_MOBILE);

} else if (STAGING_HOST && current_host.search(STAGING_HOST) != -1) {// Or the staging site?
	// then redirect to live
	redirect(STAGING_HOST,STAGING_MOBILE,LIVE_HOST,LIVE_MOBILE);

} else {
	console.log('I appear to be lost...');
}

function checkForMobile(host, check) {
	switch (check.type) {
		case 'qs':
			return getQueryString(check.value);
			break;
		case 'd':
			return (current_host == check.value + '.' + host);
			break;
	}
	return false;
}

function getQueryString(qs) {
	var url = window.location.href;
	return (url.indexOf('?' + qs) != -1 || url.indexOf('&' + qs) != -1 );
}

function redirect(fromHost,fromMobile,toHost,toMobile) {
	var gotoUrl = window.location.protocol + '//',
		path = window.location.href.replace(gotoUrl + window.location.host,'');
	if (checkForMobile(fromHost, fromMobile)) {
		if (toMobile.type == 'd') {
			// use the subdomain
			gotoUrl += toMobile.value + '.';
		}
		gotoUrl += toHost;
		gotoUrl += path;
		if (toMobile.type == 'qs') {
			if (gotoUrl.indexOf('?') == -1) {
				gotoUrl += '?' + toMobile.value;
			} else {
				gotoUrl += '&' + toMobile.value;
			}
		}
	} else {
		gotoUrl += toHost;
		gotoUrl += path;
	}
	console.log("redirecting to " + gotoUrl);
	window.location.href = gotoUrl;
}
