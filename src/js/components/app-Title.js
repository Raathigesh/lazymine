/*global require, module*/
/** @jsx React.DOM */
var React = require('react');

var Title = React.createClass({
    render : function () {
        "use strict";
        return (
            <div className="row">
				<div className="col-md-12">
					<h4>
						{this.props.text}
					</h4>
				</div>
			</div>
        );
    }
});

module.exports = Title;