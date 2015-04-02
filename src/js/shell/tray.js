// Load library
var gui = require('nw.gui');

// Reference to window and tray
var win = gui.Window.get();
var tray;

// Show tray
tray = new gui.Tray({
    icon: 'assets/icon_128.png'
});

tray.on('click', function () {
    win.show();
    this.remove();
    tray = null;
});

win.on('minimize', function () {
    // Hide window
    this.hide();

    tray = new gui.Tray({
        icon: 'assets/icon_128.png'
    });

    tray.on('click', function () {
        win.show();
        this.remove();
        tray = null;
    });
});