define(['d3', 'lib/byhour.js'],
       function(d3, ByHour) {

  var socket;
  var svg;
  var svg_width, svg_height;

  var current_dataset;
  var current_bands;

    // Constructor
  var Visualizer = function(this_socket) {

    socket = this_socket;

    svg = d3.select("body")
            .append("svg");

    this.current_graph = ByHour;

    var resizeSVG = function() {
      svg_width = window.innerWidth;
      svg_height = window.innerHeight;
      svg.attr("width", svg_width)
         .attr("height", svg_height);

        if (current_dataset) {
          this.current_graph.resizeGraph(current_dataset, current_bands);
        }
    };

    resizeSVG();
    window.addEventListener('resize', resizeSVG, false);

  };

  Visualizer.prototype.load = function() {
    this.current_graph.initializeGraph(svg);
  };



  return Visualizer;

});
