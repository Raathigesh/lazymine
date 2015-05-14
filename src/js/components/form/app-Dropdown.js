/** @jsx React.DOM */
var React = require('react');
    AppActions = require('../../actions/app-actions');

var DropDown = React.createClass({

    getValue: function(){
      return React.findDOMNode(this.refs.selectBox).value;
    },
    render : function(){
        var onChange= null;

        if(this.props.onChange){
            onChange = this.props.onChange;
        }

        var items =  this.props.data.map(function(item, i) {
            return(
               <option value={item.id}>{item.text}</option>
            );
        });

        return (
           <div className="form-group form-group-label">
            <div className="row">
              <div className="col-lg-12 col-sm-12">
                <label className="floating-label" for="float-select">Activity</label>
                <select ref="selectBox" className="form-control" id="float-select" onChange={onChange}>
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