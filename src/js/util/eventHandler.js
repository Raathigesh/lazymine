/*global require, exports*/
var Rx = require('rx');

function getEnumerablePropertyNames(target) {
    "use strict";
    var result = [],
        key;

    for (key in target) {
        result.push(key);
    }
    return result;
}

exports.create = function () {
    "use strict";
    var subject = function () {
        subject.onNext.apply(subject, arguments);
    };

    getEnumerablePropertyNames(Rx.Subject.prototype).forEach(function (property) {
        subject[property] = Rx.Subject.prototype[property];
    });
    Rx.Subject.call(subject);

    return subject;
};