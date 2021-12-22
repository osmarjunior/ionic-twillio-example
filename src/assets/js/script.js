document.addEventListener('deviceready', function () {
    if (window.device.platform === 'iOS') {
        cordova.plugins.iosrtc.registerGlobals();

		// Enable iosrtc debug (Optional)
		cordova.plugins.iosrtc.debug.enable('*', true);
      }
})