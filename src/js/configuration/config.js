var path = require('path');

(function () {
    "use strict";
    var configKey = "config_file_path",
        nwPath = process.execPath;
    localStorage.setItem(configKey, path.dirname(nwPath) + "/configuration.json");
}());
