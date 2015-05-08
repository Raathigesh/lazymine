/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Loader = React.createClass({
    render : function(){

        var className = "overlay hide";

        if(this.props.isLoading){
            className = "overlay";
        }
        else {
            className = "overlay hide";
        }

        return (
            <div className={className}>
                <div>
                    <img src="assets/Cat.GIF"/>
                    <h4>Fetching Your Data</h4>
                </div>
            </div>
        );
    }
});

module.exports = Loader; 