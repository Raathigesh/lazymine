var gui = require('nw.gui'), // Load native UI library
    win = gui.Window.get(); // Get the current window

if (!localStorage.windowWidth) {
    win.width = screen.availWidth / 2;
    localStorage.windowWidth = win.width;
} else {
    win.width = localStorage.windowWidth;
}

if (!localStorage.windowHeight) {
    win.height = screen.availHeight;
    localStorage.windowHeight = win.height;
} else {
    win.height = localStorage.windowHeight;
}

if (!localStorage.windowX) {
    win.x = screen.availWidth / 2;
    localStorage.windowX = win.x;
} else {
    win.x = localStorage.windowX;
}

if (!localStorage.windowY) {
    win.y = 0;
    localStorage.windowY = win.y;
} else {
    win.y = localStorage.windowY;
}

win.on('close', function () {
    localStorage.windowHeight = win.height;
    localStorage.windowWidth = win.width;
    localStorage.windowX = win.x;
    localStorage.windowY = win.y;

    this.close(true);
});