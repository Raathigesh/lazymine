var path = require('path'),
	os = require('os');

(function () {
    "use strict";
    var configKey = "config_file_path",
        configPath = '';

    switch (os.platform()) {
        case 'darwin':
            configPath = '~/Library/Application Support/Lazymine';
            break;
        case 'win32':
            configPath = process.execPath;
            break;
        case 'linux':
        // LOL?
        default:
            configPath = process.execPath;
            break;
    }
    localStorage.setItem(configKey, path.dirname(configPath) + "/configuration.json");
}());
