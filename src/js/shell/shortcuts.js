/*global require, localStorage, screen*/
var gui = require('nw.gui'); // Load native UI library


(function () {
    "use strict";
    var win = gui.Window.get(),
        OpenWindowShortcut = new gui.Shortcut({
            key: "Ctrl+Shift+A",
            active: function () {
                win.show();
                $("#search").focus();
            },
            failed: function (msg) {
                // :(, fail to register the |key| or couldn't parse the |key|.
                console.log(msg);
            }
        });
    gui.App.registerGlobalHotKey(OpenWindowShortcut);
}());
