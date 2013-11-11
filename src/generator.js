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

		function destroy() {
			$('#hostSwitcherGenerator').remove();
		}
	})(jQuery);
}



function includeJQ() {
	getScript('http://code.jquery.com/jquery.min.js', function() {
		if (typeof jQuery=='undefined') {
			console.log("Couldn't load jQuery - giving up!");
			// should do some cleanup here...
		} else {
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
