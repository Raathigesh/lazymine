/*global require*/
var gui = require('nw.gui');
var currentVersion = gui.App.manifest.version;

var updater = require('nw-updater')({'channel':'beta', 'currentVersion': currentVersion, 'endpoint':'http://torrentv.github.io/update.json', 'pubkey': '-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAvrj8poA6o0tda3+4FTppeeNuhCrWE4/CxoSNpXdUKjLB/4g1csvs42WPh8ve\nwCMWqSIu6OC4qmX0OB41egVyRZIbqG9H+FVqduVwmT7dHGbKcpEmEqtV8odKAreFjebdK2Jx\nmJl57OWiFOPoeXLUcUxzeeZjwVqGqHrsSWGAYzYP1WizdaLU1VkMWGIaJQ6ay0MjWq+w/y0f\nICaqATZk3+KgUjZ18jFnzo98GyLStzygIcSDqyuNLRB7jBWl0iwBCl5lFK9RW0JOVev6XWVc\nyyOnSIRNG0QTT5MWqxiHQWJZPdZ6ssGQPGYsUC8U7HM8yIk9VQtwWadEfGEtGkOlnQIDAQAB\n-----END RSA PUBLIC KEY-----'});

var newUpdateAvailabilityCallback;
var newUpdateInstalledCallback;

(function () {
    "use strict";
    // Reference to window and tray
    var win = gui.Window.get(),
        menu = new gui.Menu(),
        tray;

    // Show tray
    tray = new gui.Tray({
        icon: 'assets/icon_16.png'
    });

    tray.on('click', function () {
        win.show();
    });

    menu.append(new gui.MenuItem({
        label: "Show",
        click: function () {
            win.show();
        }
    }));

    win.showDevTools();

   menu.append(new gui.MenuItem({
        label: "Update",
        click: function () {
          updater.update();
        }
    }));

    updater.on("download", function(version) {
        newUpdateAvailabilityCallback(version);
    });

    updater.on("installed", function() {
        newUpdateInstalledCallback();
    });

    menu.append(new gui.MenuItem({ type: 'separator' }));

    menu.append(new gui.MenuItem({
        label: "Exit",
        click: function () {            
            gui.App.quit();
        }
    }));

    tray.menu = menu;
}());

var checkForUpdate = function (callback, installedCallback) {
    newUpdateAvailabilityCallback =  callback;
    newUpdateInstalledCallback = installedCallback;
    updater.check();
}

var installUpdate = function () {
    updater.update();
}
