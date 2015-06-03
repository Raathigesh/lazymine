/*
    A rather hacky way of solving an issue with ReactJS component event propagation.
    http://stackoverflow.com/questions/24415631/reactjs-syntheticevent-stoppropagation-only-works-with-react-events
*/

$(function(){
    $('.icon-launch').on('click', function(e){
        e.stopPropagation();
    });
    $('.icon-delete').on('click', function(e){
        e.stopPropagation();
    });
});