/*global require, module, $*/
/*Modification of http://tonyspiro.com/dev/react-typeahead-search*/
/** @jsx React.DOM */
var React = require('react'),
    AppActions = require('../actions/app-actions');

var SearchItem = React.createClass({
    getInitialState: function () {
        "use strict";
        return {
            "Classes": "tile result"
        };
    },
    _removeActive: function () {
        "use strict";
        if (this.isMounted()) {
            this.setState({
                "Classes": "tile result"
            });
        }
    },
    _addActive: function () {
        "use strict";
        if (this.isMounted()) {
            this.setState({
                "Classes": "result active"
            });
        }
    },
    _mouseOver: function () {
        "use strict";
        this.props.clearCurrent();
        if (this.isMounted()) {
            this.setState({
                "Classes": "result active"
            });
        }
    },
    _click: function () {
        "use strict";
        var id = $('#search-results .result.active').attr('data-id');
        AppActions.addIssue(id);
        this.props.togglePanel(false);
    },
    _mouseOut: function () {
        "use strict";
        if (this.isMounted()) {
            this.setState({
                "Classes": "tile result"
            });
        }
    },
    render : function () {
        "use strict";
        var item = this.props.item,
            id = this.props.item.id;
        return(<div className={this.state.Classes} id={"result-" + id} data-id={id} onMouseOver={this._mouseOver} onMouseOut={this._mouseOut} onClick={this._click}>
                  <p className="pull-right list-item-task-id" title="Task ID" dangerouslySetInnerHTML={{__html: id}}></p>
                  <p className="list-item-title" title={item.subject} dangerouslySetInnerHTML={{__html: item.formattedTitle}}></p>
                  <span className="list-item-tracker" title="Tracker name" dangerouslySetInnerHTML={{__html: "<b>" + item.tracker.name + "</b> - <span class='tracker-name' title='Project name'>" + item.project.name + "</span>"}}></span>
               </div>);
    }
});

module.exports = SearchItem;
