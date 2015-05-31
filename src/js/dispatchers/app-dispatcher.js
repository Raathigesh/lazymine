/*global require, module*/
var Dispatcher = require('./dispatcher'),
    merge = require('react/lib/Object.assign');

var AppDispatcher = merge(Dispatcher.prototype, {
    handleViewAction: function (action) {
        "use strict";
        this.dispatch({
            source: 'VIEW_ACTION',
            action: action
        });
    }
});

module.exports = AppDispatcher;
