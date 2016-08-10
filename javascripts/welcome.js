//  TOGGLES FULL SCREEN ON HOME BOOKMARK
function toggleFullScreen() {
	var doc = window.document;
	var docEl = doc.documentElement;

	var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
	var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

	if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
		requestFullScreen.call(docEl);
	} else {
		cancelFullScreen.call(doc);
	}
}

$(document).ready(function(){

	$("body").css("width", $("body").css("width"));
	$("body").css("height", $("body").css("height"));
	// $("html").css("width", $("body").css("width"));
	// $("html").css("height", $("body").css("height"));
	// TOGGLES FULL SCREEN 
	toggleFullScreen();

	// DISABLES ENTER KEY ON DATA-INFO
	// ENABLES GO TO NEXT FIELD ON ENTER
	$('[data-info]').keypress(function(event) {
	    if (event.keyCode == 13) {
	        event.preventDefault();
	        $('[tabindex=' + (1 + parseInt($(":focus").attr("tabindex"))) + ']').focus();
	    }
	});
	// HANDLES NAVIGATION POSITION WHEN KEYBOARD PRESENT 
	$("[data-slide=2] [data-info]").focus(function(){
			TweenMax.to(navigation, 0, { position:"absolute" });
	});
	$("[data-slide=2] [data-info]").blur(function(){
			TweenMax.to(navigation, 0, { position:"fixed" });
	});
	// Handles interface movement when an element is positioned underneath the soft keyboard

	var initialHeight = window.innerHeight; 
	var currentHeight;
	var heightDifference;
	$(window).bind("resize", function(){
		setTimeout(function(){			
			currentHeight = initialHeight - window.innerHeight;
			heightDifference = initialHeight - currentHeight;
			if( initialHeight > currentHeight ){
				// TweenMax.to("[data-state=active], #logo", 1, { y: ("-=" + heightDifference ) });
			} 
			if( currentHeight < initialHeight){
				// TweenMax.to("[data-state=active], #logo", 1, { y: 0 });
			}
		}, 500);
	});


	// New timeline that handles setup interface navigation 
	var interfaceTimeline = new TimelineMax;

	var dataStateArray = $("[data-slide]");
	// Navigation 
	var navigation = $("#navigation");
	var back = $("#back");
	var next = $("#next");
	var check = $("#check");

	// INTRO 
	var intro = $("#intro");
	var logo = $("#logo");
	var hand = $("#intro img");
	var introHeader = $("#intro h1");
	var introLink = $("#intro a");
	var introElements = [introHeader, introLink];
	// User info
	var userInfo = $("#user-info");
	var userInfoHeader = $("#user-info h1");
	// User profile
	var userProfile = $("#user-profile");
	var userProfileOptionsContainer = $("#profile-options");
	var userProfileOptions = $("#user-profile [data-option]");
	// User qualifications
	var userQualifications = $("#user-qualifications");
	// var logoAnimation = 
	// 	TweenMax.fromTo(logo, 1.5, 
	// 		{ top:"-=72" },
	// 		{ top:"24", opacity:1, ease: Expo.easeOut });

	function reverseTimeline() {
		interfaceTimeline.tweenTo("introIn");
	}
	function pauseTimeline() {
		interfaceTimeline.pause();
	}

	// Checks that all elements in current section are filled in
	function nextSectionCheck(){
		$("[data-state=active] [data-info]").bind("keyup", function(){
			console.log("keyup");
			if ($("[data-state=active] [data-info]:empty").length == 0) {
				// next.addClass("enabled");
				TweenMax.to(next, .3, {pointerEvents: "all", opacity: ".86"});
			} else {
				TweenMax.to(next, .3, {pointerEvents: "none", opacity: ".13"});
			}
		});
	} 
	function markSlidesInactive(){	
		dataStateArray.each(function (){
			$(this).attr("data-state", "inactive");
		});
	} 
	function introActive() {
		markSlidesInactive();
		intro.attr("data-state", "active");	
		console.log("introActive");	
	} 
	function userInfoActive() {
		markSlidesInactive();
		userInfo.attr("data-state", "active");	
		console.log("userInfoActive");	
		nextSectionCheck();
	} 
	function profileActive(){
		markSlidesInactive(); 
		console.log("userProfileActive");
		userProfile.attr("data-state", "active");
		nextSectionCheck();
	}
	function userQualificationsActive() {
		markSlidesInactive(); 
		console.log("userQualificationsActive");
		userQualifications.attr("data-state", "active");
	}
	var active;
	$("#user-profile [data-option]").click(function(){
		active = $(this);
		console.log($(this).position().left);
		if ( active.position().left > 0 ) {
			TweenMax.fromTo(userProfile, .75, { pointerEvents: "none" },{ pointerEvents: "all", scrollTo: { x: (active.position().left - 24) } });
		} else {
			TweenMax.fromTo(userProfile, .75, { scrollTo: { x: 0 } });
		}

		$("[data-option]").not($(this)).removeClass("option-active");
		$("[data-option]").not($(this)).addClass("option-inactive");
		active.removeClass("option-inactive");
		active.addClass("option-active");


		console.log("clicked option");
	});

interfaceTimeline
	// INTRO
	.addLabel("start")
	.fromTo(logo, 1.5, 
		{ y:"-=72" },
		{ y:"24", opacity:1, ease: Expo.easeOut })
	.fromTo(hand, 1.25, 
		{ y:"+=72"},
		{ y:"0", opacity:1, ease: Expo.easeOut}, .15)
	.staggerFromTo(introElements, 1,
	 	{ y: "+=48" },
	 	{ y: "0", opacity: 1, ease: Expo.easeOut }, .15, 1.15)
	.call(introActive)
	.addLabel("introIn")
	.call(pauseTimeline)
	// INTRO END, INTRO OUT
	.to(intro, 1, { x: "-100%", ease: Expo.easeOut })
	// .addLabel("introOut")
	// USER INFO IN
	.to(userInfo, 1, { x: "-100%", ease: Expo.easeOut }, "-=1")
	.fromTo(navigation, 1, 
		{ y: "+=48" }, 
		{ y: 0, opacity: 1, pointerEvents: "all", ease: Expo.easeOut })
	.call(userInfoActive)
	.addLabel("userInfoIn")
	.call(pauseTimeline)
	.to(userInfo, 1, { x: "-200%", ease: Expo.easeOut })
	.to(userProfile, 1, { x: "-100%", ease: Expo.easeOut }, "-=1")
	.call(userQualificationsActive)
	.addLabel("userQualificationsIn")
	.call(pauseTimeline)
	// .to($("#user-profile .option-inactive"), .2, { opacity: 0 })
	.to(userProfile, 1, { x: "-200%", ease: Expo.easeOut }, "+=.2")
	.to(userQualifications, 1, {x: "-100%", ease: Expo.easeOut }, "-=1")
	;

	function previous(){
		// if ( userInfo.attr("data-state") == "active") {
		// 	interfaceTimeline.tweenTo("introIn");
		// 	console.log("previous triggered");
		// }
		interfaceTimeline.tweenTo( interfaceTimeline.getLabelBefore(), { ease: Sine.easeInOut} );
	}
	function forward(){
		// if ( userInfo.attr("data-state") == "active") {
		// 	interfaceTimeline.tweenTo("introIn");
		// 	console.log("previous triggered");
		// }
		interfaceTimeline.tweenTo( interfaceTimeline.getLabelAfter(), { ease: Sine.easeInOut} );
	}

	back.click(previous);
	next.click(forward);

	introLink.click(function(){
		interfaceTimeline.play();
	});


});