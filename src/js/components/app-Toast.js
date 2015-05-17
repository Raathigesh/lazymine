/** @jsx React.DOM */
var React = require('react');

var Toast = React.createClass({
    render : function(){

        var output = null;
        var retry = null;

        if(this.props.error && this.props.error.retry){
            retry = <a href={"javascript:" + this.props.error.retry}> Retry</a>;
        }

        if(this.props.error != null){
            output =  <div className="toast toast-show">
                <div className="tooltip bottom in" id="tooltip201389" style={{top: '-654px', left: '223.703125px', display: 'block', position: 'relative'}}>
                    <div className="toast-inner tooltip-inner">
                        <a data-dismiss="toast">Dismiss</a>
                        <div className="toast-text">{ this.props.error.message } {retry}</div>
                    </div>
                </div>
            </div>
        }

        return (
           output
        );
    }
});

module.exports = Toast;