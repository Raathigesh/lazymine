var path = require('path'),
	os = require('os'),
    fs = global.require('fs');

(function () {
    "use strict";
    var configKey = "configuration",
        configPath = '';

    switch (os.platform()) {
        case 'darwin':
            configPath = process.env.HOME + "/Library/Application Support/Lazymine";
            break;
        case 'win32':
            configPath = path.dirname(process.execPath);
            break;
        case 'linux':
        // LOL?
        default:
            configPath = path.dirname(process.execPath);
            break;
    }

    var config = fs.readFileSync(configPath + "/configuration.json");
    localStorage.setItem(configKey, config);
}());
