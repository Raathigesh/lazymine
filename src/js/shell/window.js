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
        confStr = localStorage.getItem(windowKey);

    if (confStr) {
        windowConf = JSON.parse(confStr);
    }

    win.width = windowConf.width;
    win.height = windowConf.height;
    win.x = windowConf.x;
    win.y = windowConf.y;

    localStorage.setItem(windowKey, JSON.stringify(windowConf));

    /*win.on('blur', function () {
        localStorage.setItem(windowKey, JSON.stringify({
            width : win.width,
            height : win.height,
            x : win.x,
            y : win.y
        }));

        // Hide window
        this.hide();
    });*/

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
    var win = gui.Window.get();
    win.minimize();
};

var closeWindow = function () {
    "use strict";
    var win = gui.Window.get();
    win.hide();
};

var openExternalUrl = function (url) {
    "use strict";
    gui.Shell.openExternal(url);
};