/*global require, module, setInterval, console, clearInterval, quitWindow */
var settings = require('../stores/settings-manager');
var pkg = require('../../package.json');
var request = require('request');
var url = require('url');
var path = require('path');
var os = require('os');
var fs = require('fs');
var k = 0;
var d = false;
var updater = require('./updater.js');
var upd = new updater(pkg);
var newVersionCheckIntervalId = null;
var tryingForNewVersion = false;
var copyPath, execPath;
var updaterInterface = (function () {

    var hasStarted = false;
    var updateFrequency = 100;
    var nVACallback;
    function startUpdater(newVersionAvailableCallback) {

		nVACallback = newVersionAvailableCallback;
		var obj = getUpdateArguments();

		if (obj != undefined)
		{
			copyPath = obj.copyPath;
			execPath = obj.execPath;
		}


        if (!copyPath) {
            request.get(url.resolve(pkg.manifestUrl, '/version/' + pkg.version));
            //document.getElementById('version').innerHTML = 'current version ' + pkg.version;
            newVersionCheckIntervalId = setInterval(function () {
                if (!d && !tryingForNewVersion) {
                    tryingForNewVersion = true; //lock
                    upd.checkNewVersion(versionChecked);
                }
            }, 500);
        } else {
            //document.getElementById('version').innerHTML = 'copying app';
            upd.install(copyPath, newAppInstalled);
        }
    }

    function newAppInstalled(err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(execPath);
        upd.run(execPath, null);
       // gui.App.quit();
	   quitWindow();
    }

    function versionChecked(err, newVersionExists, manifest) {
        tryingForNewVersion = false; //unlock
        if (err) {
            console.log(err);
            return Error(err);
        } else if (d) {
            console.log('Already downloading');
            return;
        } else if (!newVersionExists) {
            console.log('No new version exists');
            return;
        }
       // nVACallback();
	   d = true;
        clearInterval(newVersionCheckIntervalId);
        var loaded = 0;
        var newVersion = upd.download(function (error, filename) {
            newVersionDownloaded(error, filename, manifest);
        }, manifest);

        newVersion.on('data', function (chunk) {
            loaded += chunk.length;
            //document.getElementById('loaded').innerHTML = "New version loading " + Math.floor(loaded / newVersion['content-length'] * 100) + '%';
        });
    }

	function downloadUpdate()
	{

	}

    function newVersionDownloaded(err, filename, manifest) {
        if (err) {
            console.log(err);
            return Error(err);
        }
        //document.getElementById('loaded').innerHTML = "unpacking: " + filename;
        upd.unpack(filename, newVersionUnpacked, manifest);
    }

    function newVersionUnpacked(err, newAppPath) {
        if (err) {
            console.log(err);
            return Error(err);
        }
        console.log(newAppPath);
        console.log(upd.getAppPath());
        console.log(upd.getAppExec());
        var runner = upd.runInstaller(newAppPath, [upd.getAppPath(), upd.getAppExec()]);
        quitWindow();
    }


    return {
        startUpdater: function (newVersionAvailableCallback) {
            console.log("Updater call");
			      startUpdater(newVersionAvailableCallback);
        },
        installUpdate: function () {
            debugger;
            console.log("Install Called");
        }
    };


}());

module.exports = updaterInterface;
