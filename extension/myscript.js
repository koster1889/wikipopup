

var popup = "<div id='popup' class='mw-content-ltr' style='font-size: 0.8em; display: none; width: 400px; top: 40px; right:50;'>some text here</div></div>";
var spinner = "<>"; //FIXME

var animationOffset = 15;
var mouseOffset = 30;
var fullWidth = 400;
var srcElement = 0;
var realUrl = 0;
var fullResult = "";
var fullscreen = false;
var canceledBeforeOpen = 0;
var canceledClose = 0;
var isOpen = false;

// Running on startup
function setup() {
	$('body').prepend(popup);
	popup = $("#popup");
	$("#popup").css('position', 'absolute');
	$("#popup").css('z-index', '999');
}

// Opening the popup
function open(event){

//	alert("Open " + self.title);

	x = event.clientX;
	y = event.clientY;
	if(x + fullWidth > $( window ).width()){
		// Far out.
		x = x - fullWidth;
	}

//Load page via ajax
		realUrl = event.originalEvent.srcElement.href;
		if(!realUrl) {
			// Not a link?
			canceledBeforeOpen --;
			return;
		}
		srcElement = event.originalEvent.srcElement;
		var divider = "/wiki/";
		if (realUrl.indexOf("File:") > 0) {
			//alert("File...");
			canceledBeforeOpen --;
			return;
		}
		var i = realUrl.indexOf(divider);
		
		if (i < 0) {
			//Not a artickel!
			canceledBeforeOpen --;
			return;
		}

	//Check if this item is preloaded
	if (!event.originalEvent.srcElement.getAttribute("popupHtml")) {

		var url = realUrl.substring(i+divider.length); 
		$.ajax({
			url: url, // + '?action=render',
			context: $("#popup"),
			error: function () {
			canceledBeforeOpen --;
		}, success: function (result) {
					
				}
			}).done(function(result) {
// Set the result
					fullResult = "<div>"+result+"</div>";
					//$(fullResult);

					stuff = $(fullResult).find("#mw-content-text").find("p");
					narrow = $(stuff).has("b").first();

					if(narrow.length == 0) {
						narrow = stuff;
					}

					popup.html(narrow);
					// And save it for laterz
					event.originalEvent.srcElement.setAttribute("popupHtml", popup.html());
		});
	} else {
		// Use the preloaded html from the link-tag
		popup.html(event.originalEvent.srcElement.getAttribute("popupHtml"));
	}
	
	formatPopupHtml();
}

function formatPopupHtml() {
	popup.css('width', '400px')
	$("#popup").css('top', (y + document.documentElement.scrollTop
+ document.body.scrollTop)+mouseOffset+animationOffset+'px');
	$("#popup").css('opacity', '1');
	$("#popup").css('left', 
			(x+mouseOffset + document.documentElement.scrollLeft
+ document.body.scrollLeft) + 'px');

	$("#popup").css('display', 'block');
	isOpen = true;
	$("#popup").animate({top: ('-=' + animationOffset)}, 100, function(){});
}


function loadLink(event){

	if(canceledBeforeOpen > 0) {
		canceledBeforeOpen --;
		return;
	}

	popup.html(spinner);
	//popup.css('width', '50px');

	open(event);
}

function close(event){
	$("#popup").css('display', 'none');
	isOpen = false;
}

function startTimer(event){
	setTimeout(function(){loadLink(event)},500);
}

$("a").mouseover(function(event) {startTimer(event)});
$("a").mouseout(function(event) {
		if(isOpen){
			close(event);
		} else {
			canceledBeforeOpen ++;
		}
	});

setup();