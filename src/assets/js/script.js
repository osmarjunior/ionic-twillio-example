document.addEventListener('deviceready', function () {
    if (window.device.platform === 'iOS') {

        if (typeof Twilio === 'object') {
            alert('twillio');
        }

        alert('FOI AQUI');
        cordova.plugins.iosrtc.registerGlobals();

		// Enable iosrtc debug (Optional)
		cordova.plugins.iosrtc.debug.enable('*', true);
      }
})