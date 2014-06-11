define(['d3'], function(d3) {

  var socket;
  var svg_width, svg_height;

  // Constructor
  var Visualizer = function(this_socket) {

    socket = this_socket;

    var resizeSVG = function() {
      svg_width = window.innerWidth;
      svg_height = window.innerHeight;
    };

    resizeSVG();
    window.addEventListener('resize', resizeSVG, false);

  };

  Visualizer.prototype.load = function() {

    $.getJSON('/tweets/bytime/24', function(data) {
      //$('#console').text(data);
      console.log(data);
    });

  };

  return Visualizer;

});
