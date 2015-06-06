/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    easyGid = require("easy-guid");

var DropDown = React.createClass({
    getValue: function () {
        "use strict";
        return React.findDOMNode(this.refs.selectBox).value;
    },
    render : function () {
        "use strict";
        var onChange = null,
            className = "form-group form-group-label",
            items,
            opt,
            identifier = easyGid.new();

        if (this.props.onChange) {
            onChange = this.props.onChange;
        }

        items =  this.props.data.map(function (item, i) {
            opt = <option value={item.id}>{item.text}</option>;
            if(this.props.initialValue === item.id){
                opt = <option value={item.id} selected="selected">{item.text}</option>;
                className = className + "  control-highlight";
            }
            return(
                opt
            );
        }.bind(this));

        return (
           <div className={className}>
            <div className="row">
              <div className="col-lg-12 col-sm-12">
                <label className="floating-label" htmlFor={identifier}>Activity</label>
                <select ref="selectBox" className="form-control" id={identifier} onChange={onChange}>
                  <option value=""></option>
                  {items}
                </select>
              </div>
            </div>
          </div>
        );
    }
});

module.exports = DropDown;