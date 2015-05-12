/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var DatePicker = React.createClass({
    render : function(){
        return (
            <div className="row">
                <div className="form-group">
                    <div className="row">
                        <div className="col-lg-2 col-md-3 col-sm-4">
                            <label className="form-label" for="datepicker-adv-1">Material Datepicker</label>
                        </div>
                        <div class="col-lg-4 col-md-6 col-sm-8">
                            <input className="datepicker-adv datepicker-adv-default form-control" id="datepicker-adv-1" type="text" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = DatePicker;