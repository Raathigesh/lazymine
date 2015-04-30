/*Modification of http://tonyspiro.com/dev/react-typeahead-search*/
/** @jsx React.DOM */
var React = require('react');
var AppActions = require('../actions/app-actions');

var SearchItem = React.createClass({

    getInitialState: function () {
      return {
       "Classes": "result"
      };
    },

    _removeActive: function(){
      this.setState( {
       "Classes": "result"
      });
    },

    _addActive: function(){
      this.setState( {
       "Classes": "result active"
      });
    },

    _mouseOver: function () {   
      this.props.clearCurrent();
      this.setState( {
          "Classes": "result active"
      });
    },

    _click: function () {
      var id = $('#search-results .result.active').attr('data-id');
      AppActions.addIssue(id);
      this.props.togglePanel(false);
    },

    _mouseOut: function () {
      this.setState( {
          "Classes": "result"
      });
    },

    render : function () {
      "use strict";
      var item = this.props.item;
      var id = this.props.item.id;
      
      return (
        <li>
          <div className={this.state.Classes} id={"result-" + id} data-id={id} onMouseOver={this._mouseOver} onMouseOut={this._mouseOut} onClick={this._click}>
            <div className="searchResult-projectName" dangerouslySetInnerHTML={{__html: item.project.name}}></div>
            <span className="searchResult-description" dangerouslySetInnerHTML={{__html: item.formattedTitle}}></span>
          </div>
        </li>
      );
    }
});

module.exports = SearchItem;
