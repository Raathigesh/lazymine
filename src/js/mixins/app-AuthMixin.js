var React = require('react'),
    AppStore = require('../stores/app-base-store'),
    AppRoutes = require('../constants/app-routes');

var AuthMixin = {
    statics: {
        willTransitionTo: function (transition, params, query) {
            "use strict";
            switch(transition.path.toLowerCase()) {

                case AppRoutes.Login:
                    if (AppStore.getState().settings.available) {
                        transition.redirect(AppRoutes.Home, params, query);
                    }
                    break;
                default:
                    if (!AppStore.getState().settings.available) {
                        transition.redirect(AppRoutes.Login, params, query);
                    }
                    break;
            }
        },
        willTransitionFrom: function (transition, component) {
            switch(transition.path.toLowerCase()) {
                case AppRoutes.Login:
                    if (AppStore.getState().settings.available) {
                        transition.abort();
                    }
                    break;
            }
        }
    },

    componentWillMount: function () {
        "use strict";
        AppStore.addChangeListener(this.validateAuth);
    },

    componentWillUnmount: function() {
        "use strict";
        AppStore.removeChangeListeners(this.validateAuth);
    },

    validateAuth: function() {
        "use strict";
        var currentRouteName = this.context.router.getCurrentPathname();

        switch(currentRouteName.toLowerCase()) {
            case AppRoutes.Login:
                if(AppStore.getState().settings.available) {
                    this.context.router.transitionTo(AppRoutes.Home);
                }
                break;
            default:
                if(!AppStore.getState().settings.available) {
                    this.context.router.transitionTo(AppRoutes.Login);
                }
                break;
        }
    }
};

module.exports = AuthMixin;