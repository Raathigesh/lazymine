var path = require('path'),
    os = require('os'),
    fs = global.require('fs');

(function () {
    "use strict";
    var configKey = "configuration",
        configPath = '',
        config = '';

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

    try {
        config = fs.readFileSync(configPath + "/configuration.json");
    } catch (e) {
        // If this fails, it's probably lasitha.
        config = fs.readFileSync(process.cwd() + "/configuration.json");
    }
    localStorage.setItem(configKey, config);
}());
