/*global require, localStorage, screen*/
var gui = require('nw.gui'); // Load native UI library


(function () {
    "use strict";
    var win = gui.Window.get(), // Get the current window
        windowKey = "window",
        windowConf = {
            width : screen.availWidth / 2,
            height : screen.availHeight,
            x : screen.availWidth / 2,
            y : 0
        },
        confStr = localStorage.getItem(windowKey),
		startInTray = false;
	
    if (confStr) {
        windowConf = JSON.parse(confStr);
    }

    if (windowConf.width > screen.availWidth ||
        windowConf.height > screen.availHeight ||
        windowConf.x > screen.availWidth ||
        windowConf.y > screen.availHeight) {

        windowConf = {
            width : screen.availWidth / 2,
            height : screen.availHeight,
            x : screen.availWidth / 2,
            y : 0
        };
    }

    win.width = windowConf.width;
    win.height = windowConf.height;
    win.x = windowConf.x;
    win.y = windowConf.y;

    localStorage.setItem(windowKey, JSON.stringify(windowConf));
	
	for (var i = 0; i < gui.App.argv.length; i++){
		if (gui.App.argv[i] == '--tray'){
			startInTray = true;
		}
	}
	
	if (!startInTray) {
		win.show();
	}

    win.on('close', function () {
        localStorage.setItem(windowKey, JSON.stringify({
            width : win.width,
            height : win.height,
            x : win.x,
            y : win.y
        }));

        this.hide();
    });
}());

var minimizeWindow = function () {
    "use strict";
    var win = gui.Window.get(),
        windowKey = "window";

    localStorage.setItem(windowKey, JSON.stringify({
        width : win.width,
        height : win.height,
        x : win.x,
        y : win.y
    }));

    win.minimize();
};

var closeWindow = function () {
    "use strict";
    var win = gui.Window.get(),
        windowKey = "window";

    localStorage.setItem(windowKey, JSON.stringify({
        width : win.width,
        height : win.height,
        x : win.x,
        y : win.y
    }));

    win.hide();
};

var openExternalUrl = function (url) {
    "use strict";
    gui.Shell.openExternal(url);
};