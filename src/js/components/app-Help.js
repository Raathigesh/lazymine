/*global require, module*/
/** @jsx React.DOM */
var React = require('react');

var Help = React.createClass({  

    render: function () {
       "use strict";

        return (
            <div className="help-text text-center"> 
                Tip: Use filters to refine your search
                <ul>
                    <li> #p : #p 'Project Name' 'Search Term' : #P Spartan Meeting </li>
                    <li> #id : #id 'Issue Id' : #id 2015 </li>
                </ul>
            </div>
        );
    }
});

module.exports = Help;