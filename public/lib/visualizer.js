define(['d3', 'lib/easing.js'], function(d3, easing) {

  var socket;
  var svg;
  var svg_width, svg_height;
  var easing_functions = easing;

  var current_dataset;
  var current_bands;

  var c1 = 205, c2 = 147, c3 = 176;
  var colors = [];

  colors.push([c1, c2, c2]);
  colors.push([c1, c2, c3]);
  colors.push([c1, c2, c1]);
  colors.push([c3, c2, c1]);
  colors.push([c2, c2, c1]);
  colors.push([c2, c3, c1]);
  colors.push([c2, c1, c1]);
  colors.push([c2, c1, c3]);
  colors.push([c2, c1, c2]);
  colors.push([c3, c1, c2]);

  colors = colors.reverse();


  var getFillStyle = function(percent) {

    var alpha = easing_functions.easeOutCubic(percent, 0, 1, 1);
    var index = Math.floor(easing_functions.easeInCubic(percent, 0, 1, 1) * 10);
    if (index === 10) {
        index = 9;
    }
    var color_set = colors[index];
    var r = color_set[0], g = color_set[1], b = color_set[2];

    var fill = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
    return fill;
  };

   var scaleBars = function(bars, bands) {

        var yScale = d3.scale.linear()
            .domain([0, d3.max(current_dataset, function(d) { return d.value.tweets.length; })])
            .range([0, svg_height]);

        var xScale = d3.scale.ordinal()
            .domain(d3.range(bands))
            .rangeRoundBands([0, svg_width], 0.05);

        bars.attr("x", function(d, i) {
                return xScale(i);
            })
            .attr("y", function(d) {
                return svg_height - yScale(d.value.tweets.length);
            })
            .attr("width", xScale.rangeBand())
            .attr("height", function(d) {
                return yScale(d.value.tweets.length);
            })
            .attr("fill", function(d) {
                return getFillStyle(yScale(d.value.tweets.length) / svg_height);
            });
  };


  var resizeGraph = function(dataset, bands) {

        var bars = svg.selectAll("rect").data(dataset);
        scaleBars(bars.transition().duration(1), bands);
  };

  var calculateGraph = function(bands) {

    current_bands = bands;

    $.getJSON('/tweets/bytime/' + bands, function(dataset) {

        current_dataset = dataset;

        var key = function(d) {
            return d._id;
        };

        scaleBars(svg.selectAll("rect")
           .data(dataset, key)      //Bind data with custom key function
           .enter()
           .append("rect"), bands);

        /*
            //Create labels
            svg.selectAll("text")
               .data(dataset, key)      //Bind data with custom key function
               .enter()
               .append("text")
               .text(function(d, i) {
                    return d._id + " :: " + d.value.tweets.length;
               })
               .attr("text-anchor", "middle")
               .attr("x", function(d, i) {
                    return xScale(i) + xScale.rangeBand() / 2;
               })
               .attr("y", function(d) {
                    return svg_height - yScale(d.value.tweets.length) + 14;
               })
               .attr("font-family", "sans-serif")
               .attr("font-size", "11px")
               .attr("fill", "white");
        */
    });

  };

    // Constructor
  var Visualizer = function(this_socket) {

    socket = this_socket;

    svg = d3.select("body")
            .append("svg");

    var resizeSVG = function() {
      svg_width = window.innerWidth;
      svg_height = window.innerHeight;
      svg.attr("width", svg_width)
         .attr("height", svg_height);

        if (current_dataset) {

          resizeGraph(current_dataset, current_bands);
        }
    };

    resizeSVG();
    window.addEventListener('resize', resizeSVG, false);

  };

  Visualizer.prototype.load = function() {
        calculateGraph(24);
  };



  return Visualizer;

});
