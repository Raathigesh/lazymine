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
        this.setState({
            "Classes": "tile result"
        });
    },
    _addActive: function () {
        "use strict";
        this.setState({
            "Classes": "result active"
        });
    },
    _mouseOver: function () {
        "use strict";
        this.props.clearCurrent();
        this.setState({
            "Classes": "result active"
        });
    },
    _click: function () {
        "use strict";
        var id = $('#search-results .result.active').attr('data-id');
        AppActions.addIssue(id);
        this.props.togglePanel(false);
    },
    _mouseOut: function () {
        "use strict";
        this.setState({
            "Classes": "tile result"
        });
    },
    render : function () {
        "use strict";
        var item = this.props.item,
            id = this.props.item.id;
        return(<div className="col-xs-9 col-md-9 section-box" className={this.state.Classes} id={"result-" + id} data-id={id} onMouseOver={this._mouseOver} onMouseOut={this._mouseOut} onClick={this._click}>
                  <p className="list-item-title" dangerouslySetInnerHTML={{__html: item.project.name}}></p>
                  <p className="list-item-description" title={item.subject} dangerouslySetInnerHTML={{__html: item.formattedTitle}}></p>
               </div>);
    }
});

module.exports = SearchItem;
