var Dispatcher = require('./dispatcher');
var merge = require('react/lib/Object.assign');

var AppDispatcher = merge(Dispatcher.prototype, {
    handleViewAction: function (action) {
        this.dispatch({
            source: 'VIEW_ACTION',
            action: action
        })
    }
});

module.exports = AppDispatcher;
