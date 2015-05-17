/** @jsx React.DOM */
var React = require('react');

var Toast = React.createClass({
    render : function(){

        if(this.props.error != null){
            alert(this.props.error.code + " : " + this.props.error.message);
        }

        return (
            null
        );
    }
});

module.exports = Toast;