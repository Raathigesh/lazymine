var React = require('react'),
    AppStore = require('../stores/app-base-store');

var StateMixin = {
    getInitialState: function () {
        "use strict";
        return AppStore.getState();
    },
    componentWillMount: function () {
        "use strict";
        AppStore.addChangeListener(this._change);
    },
    componentWillUnmount: function() {
        "use strict";
        AppStore.removeChangeListeners(this._change);
    },
    _change: function () {
        "use strict";
        var storeState = AppStore.getState();
        if (this.isMounted()) {
            this.setState(storeState);
        }
    }
};

module.exports = StateMixin;