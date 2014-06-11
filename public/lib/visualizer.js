define(['d3', 'lib/easing.js', 'underscore'],
       function(d3, easing, _) {

  var socket;
  var svg;
  var svg_width, svg_height;
  var easing_functions = easing;

  var current_dataset;
  var current_bands;
  var current_scale = {};

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


  var getFillStyle = function(percent, alpha_override) {

    //var alpha = easing_functions.linear(percent, 0, 1, 1);
    var alpha = alpha_override || 0.8;
    var index = Math.floor(easing_functions.linear(percent, 0, 1, 1) * 10);
    if (index === 10) {
        index = 9;
    }
    var color_set = colors[index];
    var r = color_set[0], g = color_set[1], b = color_set[2];

    var fill = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
    return fill;
  };


  var setScale = function(current_dataset, bands) {

    var yScale = d3.scale.linear()
        .domain([0, d3.max(current_dataset, function(d) { return d.value.tweets.length; })])
        .range([0, svg_height]);

    var xScale = d3.scale.ordinal()
        .domain(d3.range(bands))
        .rangeRoundBands([0, svg_width - (2 * 30)], 0.05);

    current_scale['x'] = xScale;
    current_scale['y'] = yScale;
  };

   var scaleBars = function(bars, bands) {

        bars.attr("x", function(d, i) {
                return current_scale.x(i);
            })
            .attr("y", function(d) {
                return svg_height - current_scale.y(d.value.tweets.length);
            })
            .attr("width", current_scale.x.rangeBand())
            .attr("height", function(d) {
                return current_scale.y(d.value.tweets.length);
            });
  };

 var scaleText = function(text, bands) {


        text.attr("x", function(d, i) {
            return current_scale.x(i) + current_scale.x.rangeBand() / 2;
           })
           .attr("y", function(d) {
                return svg_height - current_scale.y(d.value.tweets.length) + 14;
           });
  };


  var resizeGraph = function(dataset, bands) {

        setScale(dataset, bands);

        var bars = svg.selectAll("rect").data(dataset);
        scaleBars(bars.transition().duration(1), bands);

        //var text = svg.selectAll("text").data(dataset);
        //scaleText(text, bands);
  };


  var getEmptyRecord = function(id) {
    return {
        '_id': id,
        'value': { 'tweets': [] }
    };
  };

  var cleanedDataset = function(dataset, bands) {

    var cloned_ds = _.clone(dataset);

    _.each(_.range(bands), function(i) {
        if (!cloned_ds[i] || cloned_ds[i]['_id'] !== i) {
            console.log('Got here');
            cloned_ds.splice(i, 0, getEmptyRecord(i));
        }
    });

    console.log(cloned_ds);

    return cloned_ds;
  };

  var calculateGraph = function(bands) {

    current_bands = bands;

    $.getJSON('/tweets/bytime/' + bands, function(ds) {

        current_dataset = cleanedDataset(ds, bands);

        var key = function(d) {
            return d._id;
        };


        setScale(current_dataset, bands);

        scaleBars(svg.selectAll("rect")
           .data(current_dataset, key)      //Bind data with custom key function
           .enter()
           .append("rect")
           .attr("fill", function(d) {
                return getFillStyle(current_scale.y(d.value.tweets.length) / svg_height);
            })
           .on("mouseover", function(d) {
                d3.select(this)
                  .transition(1000)
                  .attr("fill", getFillStyle(current_scale.y(d.value.tweets.length) / svg_height, 1));

                //Get this bar's x/y values, then augment for the tooltip
                var xPosition = parseFloat(d3.select(this).attr("x")) + current_scale.x.rangeBand() / 2;
                var yPosition = Math.max(0, parseFloat(d3.select(this).attr("y")) - 40);

                //Update the tooltip position and value
                d3.select("#tooltip")
                  .style("left", xPosition + "px")
                  .style("top", yPosition + "px")
                  .select("#value")
                  .text(d._id + " hours had " + d.value.tweets.length + " tweets.");

                //Show the tooltip
                d3.select("#tooltip").classed("hidden", false);
           })
           .on("mouseout", function(d) {
                d3.select(this)
                  .transition(1000)
                  .attr("fill", getFillStyle(current_scale.y(d.value.tweets.length) / svg_height));

                d3.select("#tooltip").classed("hidden", true);

            }), bands);

        //Create labels
        /*
        scaleText(svg.selectAll("text")
               .data(current_dataset, key)      //Bind data with custom key function
               .enter()
               .append("text")
               .text(function(d, i) {
                    return d._id + " :: " + d.value.tweets.length;
               })
               .attr("text-anchor", "middle")
               .attr("font-family", "sans-serif")
               .attr("font-size", "11px")
               .attr("fill", "white"), bands); 
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
