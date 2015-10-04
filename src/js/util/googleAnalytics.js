var GoogleAnalytics = function(){
    "user strict";
    if(typeof ga_storage !== 'undefined'){
        ga_storage._setAccount('UA-65910418-1');
        ga_storage._setDomain('none');
    }
};

GoogleAnalytics.prototype = (function(){
    "use strict";
    var trackPageView = function(relativeURL){
        if(typeof ga_storage !== 'undefined'){
            ga_storage._trackPageview(relativeURL);
        }
    };
    return {
        trackPageView: trackPageView
    };
}());

module.exports = GoogleAnalytics;