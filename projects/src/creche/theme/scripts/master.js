// NAMESPACE
var ScreenTester = ScreenTester || (function () {

	"use strict";

	// GLOBAL VARS
	var frame = document.getElementById('window'),
		ruler = document.getElementById('ruler'),
		userData = JSON.parse(sessionStorage.getItem('userData')) || {},
		devices = {},
		orientation,
		url,
		deviceToCheck,
		deviceName,
		deviceWidth,
		deviceHeight,
		borderColor;

	// INITIALIZE METHOD
	var init = function init() {

		// load device list
		devices = JSON.parse( getDeviceList() );
		
		// process devices
		for (var dev in devices) {

			var link = $('<a/>').attr('href', "#"+dev).addClass('device-type').data('device', dev),
				icon = $('<img/>').attr("src", devices[dev].icon);

			link.append(icon).appendTo($('.device-holder'));

		}

		// set init state
		deviceToCheck = devices["iphone4s"];
		orientation = (userData.orientation)?userData.orientation:0;
		deviceName = (userData.deviceName)?userData.deviceName:"iphone4s";
		
		deviceToCheck = devices[ deviceName ];
		if (userData.url) {
			url = userData.url;
			frame.setAttribute("src", url);
			$('#url-input').val((url.indexOf("splash") < 0)?userData.url:"");
		}

		$('.orientation').eq(orientation)
			.addClass('active')
			.siblings()
			.removeClass('active');

		$('.device-holder a').eq( Object.keys(devices).indexOf(deviceName) )
			.addClass('active')
			.siblings()
			.removeClass('active');

		updateView();

		// bind event to button to set subject url
		$('.submit').click(function() {

			var url = $('#url-input').val(),
				urlPattern = /^(http(?:s)?)\:\/\/[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*\.[a-zA-Z]{2,6}(?:(?:\/[\w\-]+)*)(?:(?:.[a-zA-Z]{2,4}|\/))$/;

			// validate url
			if (!url || !urlPattern.test(url)) {
				return;
			}

			// set url parameter
			userData['url'] = url;
			frame.setAttribute("src", url);

		});

		// bind event to button to set orientation
		$('.orientation').click(function(e) {

			e.preventDefault();

			// set new active button
			$(this).addClass('active')
				.siblings()
				.removeClass('active');

			// set orientation var
			userData['orientation'] = orientation = $(this).data('value');

			// update view
			updateView();

		});

		// bind event to button to set subject device
		$('.device-holder a').click(function(e) {
			
			e.preventDefault();

			var $this = $(this),
				device = $this.data('device');

			// set new active button
			$this.addClass('active').siblings().removeClass('active');

			// set device to check var
			deviceToCheck = devices[device];
			userData['deviceName'] = device;

			// update view
			updateView();

			frame.contentWindow.location.reload();

		});

		$('.reload').click(function() {
			userData = {};
			window.location.reload();
		});

		// save data
		window.onunload = function(e) {
			sessionStorage.setItem('userData', JSON.stringify(userData));
		}
		
		frame.onload = function() {
			userData['url'] = frame.contentWindow.location.href;
			frame.contentDocument.body.style.overflowY = "scroll";
		}

	}; // end of init

	// ajax call for accessing device list file
	var getDeviceList = function getDeviceList() {
		var list = new XMLHttpRequest(),
			deviceList;

		list.open('GET', 'screensize.json', false);
		list.onreadystatechange = function() {
			if ( list.readyState == 4 ) {
				if ( list.status == 200 ) {
					deviceList = list.response;
				}
			}
		}
		list.send(null);
		return deviceList;
	}

	// update view
	var updateView = function updateView() {

		// set device dimension
		deviceWidth = deviceToCheck.width;
		deviceHeight = deviceToCheck.height;
		
		if (orientation) deviceWidth = [deviceHeight, deviceHeight=deviceWidth][0];

		// boderColor
		if (deviceWidth >= 320 && deviceWidth < 480) { borderColor = "#2ecc71" }
		else if (deviceWidth >= 480 && deviceWidth < 768) { borderColor = "#3498db" }
		else if (deviceWidth >= 768 && deviceWidth < 1024) { borderColor = "#9b59b6" }
		else if (deviceWidth >= 1024) { borderColor = "#e74c3c" }
		else { borderColor = "#f1c40f" }
		
		// frame.setAttribute("width", deviceWidth+15);
		// frame.setAttribute("height", deviceHeight);

		// ruler.style.width = deviceWidth+"px";
		// ruler.style.borderTopColor = borderColor;
		
		// ruler.innerHTML = deviceWidth;

		$(ruler).animate({
			width : deviceWidth
		}).text(deviceWidth)
		.css({
			'border-top-color' : borderColor
		});

		$(frame).animate({
			width : deviceWidth + 15,
			height : deviceHeight
		});
	}

	init();

}(window));