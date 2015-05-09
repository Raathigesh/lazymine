var AppConstants = require('../constants/app-action-name'),
    AppEvent = require('../constants/app-event'),
    AppDispatcher = require('../dispatchers/app-dispatcher'),
    Merge = require('react/lib/Object.assign'),
    EventEmitter = require('events').EventEmitter,
    settings = require('./settings-manager'),
    DataManager = require('./data-manager'),
    ServiceAccessor = require('./service-accessor'),
    HttpHelper = require('./http-helper');

module.exports = Merge(EventEmitter.prototype, (function () {
    "use strict";
        var ErrorState = {
                error: null
            },
            getState = function () {
                return ErrorState;
            },            
            addChangeListener = function (callback) {
                debugger
                EventEmitter.prototype.on(AppEvent.Change, callback);
            },
            removeChangeListeners = function (callback) {
                EventEmitter.prototype.removeListener(AppEvent.Change, callback);
            },
            dispatcherIndex = AppDispatcher.register(function (payload) {
                debugger
                var action = payload.action;
                switch (action.actionType) {
                    case AppConstants.StoreError:
                        ErrorState.error = action.error;
                        EventEmitter.prototype.emit(AppEvent.Change);
                        break;                   
                    }
            });

    return {
        getErrorState: getState,
        addChangeListener: addChangeListener,
        removeChangeListeners: removeChangeListeners,
        dispatcherIndex: dispatcherIndex
    };
}()));
