/** @jsx React.DOM */
var React = require('react');
var Mui = require('material-ui');
var RaisedButton = Mui.RaisedButton;

var Footer = React.createClass({
    render: function () {
        return (
            <div className="btn-group btn-group-justified" style={{position:'fixed', bottom:'1px'}}>
                <a className="btn btn-flat btn-cancel waves-button waves-effect waves-light"
                   onClick={this.props.secondaryClick}>
                    {this.props.secondaryText}
                </a>
                <a className="btn btn-flat btn-success waves-button waves-effect waves-light"
                   onClick={this.props.primaryClick}>
                    {this.props.primaryText}
                </a>
            </div>
        );
    }
});

module.exports = Footer;