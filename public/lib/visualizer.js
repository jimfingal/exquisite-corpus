define(['d3', 'lib/byhour.js'],
       function(d3, ByHour) {

  var socket;
  var svg;

  var current_graph;

  // Constructor
  var Visualizer = function(this_socket) {

    socket = this_socket;

    svg = d3.select("body")
            .append("svg");

    current_graph = ByHour;

    var resizeSVG = function() {
      var svg_width = window.innerWidth;
      var svg_height = window.innerHeight;
      svg.attr("width", svg_width)
         .attr("height", svg_height);

        if (current_graph.current_dataset) {
          current_graph.resizeGraph();
        }
    };

    resizeSVG();
    window.addEventListener('resize', resizeSVG, false);

  };

  Visualizer.prototype.load = function() {
    current_graph.initializeGraph(svg);
  };



  return Visualizer;

});
