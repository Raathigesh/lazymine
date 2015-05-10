/** @jsx React.DOM */
var React = require('react');

var TextField = React.createClass({
  getValue: function(){
      return React.findDOMNode(this.refs.textBox).value;
  },
  render : function(){

    var keyUp= null;

    if(this.props.keyUp){
       keyUp = this.props.keyUp;
    }

    return (
       <div className="form-group form-group-label">
          <div className="row">
            <div className="col-lg-12 col-sm-12">
              <label className="floating-label" for="float-text">{this.props.label}</label>
              <input ref="textBox" className="form-control" id="float-text" type="text" onKeyUp={keyUp}/>
            </div>
          </div>
      </div>
    );
  }
});

module.exports = TextField;