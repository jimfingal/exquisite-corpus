define(['d3', 'lib/byhourhist.js'],
       function(d3, ByHour) {

  var socket;
  var svg;

  var margin = {top: 20, right: 20, bottom: 20, left: 20};

  var current_graph;

  // Constructor
  var Visualizer = function(this_socket) {

    socket = this_socket;

    svg = d3.select("body").append("svg")
              .attr("width", window.innerWidth - margin.left - margin.right)
              .attr("height", window.innerHeight - margin.top - margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    current_graph = ByHour;

    var resizeSVG = function() {
      var svg_width = window.innerWidth - margin.left - margin.right;
      var svg_height = window.innerHeight - margin.top - margin.bottom;
      d3.select("svg").attr("width", svg_width)
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
