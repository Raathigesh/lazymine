/*global require, module*/
/** @jsx React.DOM */
var React = require('react');

var About = React.createClass({
    render: function () {
        "use strict";
        return (
            <div aria-hidden="true" className="modal fade" id="about" role="dialog" tabindex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-heading">
                            <a className="modal-close" data-dismiss="modal">X</a>
                            <h2 className="modal-title">Lazymine!</h2>
                        </div>
                        <div className="modal-inner">
                            <p>A god sent redmine client which will make you smile everytime you enter time.</p>
                        </div>
                        <div className="modal-footer">
                            <p className="text-right">
                                <button className="btn btn-flat btn-alt" data-dismiss="modal" type="button">Close</button>
                                <button className="btn btn-flat btn-alt" data-dismiss="modal" type="button">OK</button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = About;