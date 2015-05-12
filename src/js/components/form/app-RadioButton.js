/** @jsx React.DOM */
var React = require('react');

var RadioButton = React.createClass({
    render : function(){

        var keyUp= null;

        if(this.props.keyUp){
            keyUp = this.props.keyUp;
        }

        return (
            <div className="radio radio-adv">
                <label for="input-radio-1">
                    <input className="access-hide" id="input-radio-1" name="input-radio" type="radio" onKeyUp={keyUp}>
                        {this.props.label}
                    </input>
                    <span className="circle"></span>
                    <span className="circle-check"></span>
                </label>
            </div>
        );
    }
});

module.exports = RadioButton;
