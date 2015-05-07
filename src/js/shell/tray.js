// Load library
var gui = require('nw.gui');

(function() {
    "use strict";
    // Reference to window and tray
    var win = gui.Window.get(),
        menu = new gui.Menu(),
        tray;

    // Show tray
    tray = new gui.Tray({
        icon: 'assets/icon_128.png'
    });

    tray.on('click', function () {
        win.show();
    });

    menu.append(new gui.MenuItem({
        label: "Show",
        click: function() {            
            win.show();
        }
    }));

    menu.append(new gui.MenuItem({ type: 'separator' }));

    menu.append(new gui.MenuItem({
        label: "Exit",
        click: function() {
            // Quit current app
            gui.App.quit();
        }
    }));

    tray.menu = menu;
}());