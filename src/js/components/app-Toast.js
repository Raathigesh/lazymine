/** @jsx React.DOM */
var React = require('react');

var Toast = React.createClass({
    render : function(){

        if(this.props.message != null){
            alert(this.props.message);
        }

        return (
            null
        );
    }
});

module.exports = Toast;