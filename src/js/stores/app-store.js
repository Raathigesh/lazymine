var AppConstants = require('../constants/app-constants.js');
var AppDispatcher = require('../dispatchers/app-dispatcher.js');
var serviceAccessor = require('./service-accessor.js');

var merge = require('react/lib/merge');
var EventEmitter = require('events').EventEmitter;


var CHANGE_EVENT = "Change";

function _search(text) {
    var accessor = new serviceAccessor(AppConstants.BASE_URL, "ab821e33e7c2c67243ee7afee2055a81c64f459b"),
        successCallback = function(data){
            debugger;
        },
        failCallback = function(data){
            debugger;
        };
    accessor.getAllIssues(successCallback, failCallback);
};

var appStore = merge(EventEmitter.prototype,{
    emitChange : function(){
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback){
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function(callback){
        this.removeListener(CHANGE_EVENT, callback); 
    },
    dispatcherIndex:AppDispatcher.register(function(payload){  
        var action = payload.action;
           
        switch(action.actionType){
          case AppConstants.SEARCH:
            _search(payload.action.searchText);
            break;
        }
        
        appStore.emitChange();
        return true;
    })
});

module.exports = appStore;