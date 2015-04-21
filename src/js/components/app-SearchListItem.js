/*Modification of http://tonyspiro.com/dev/react-typeahead-search*/
/** @jsx React.DOM */
var React = require('react');

var ListItem = React.createClass({
    removeActive: function(){
      this.setState( {
       "Classes": "result"
      });
    },
    addActive: function(){
      this.setState( {
       "Classes": "result active"
      });
    },
    getInitialState: function () {
      return {
       "Classes": "result"
      };
    },
    render : function () {
        "use strict";
        var item = this.props.item;
        var id = this.props.id;
      return (
        <li>
          <div className={this.state.Classes} id={"result-" + id} data-id={id}>
            <span className="description" dangerouslySetInnerHTML={{__html: item.formattedTitle}}></span>
          </div>
        </li>
        );
    }
});

module.exports = ListItem;
