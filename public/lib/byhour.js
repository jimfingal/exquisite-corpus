define(['d3', 'lib/easing.js', 'underscore', 'jquery', 'lib/timehelper'],
       function(d3, easing, _, $, Timehelper) {

  var easing_functions = easing;

  var ByHour = {};

  var initialized = false;
  var DEFAULT_BANDS = 24;
  var DEFAULT_UTC_OFFSET = -7;

  var c1 = 205, c2 = 147, c3 = 176;
  var colors = [];
  var current_scale = {};


  var current_dataset;
  var current_bands;

  var svg;

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
        .domain([0, d3.max(current_dataset, function(d) { return d.tweets.length; })])
        .range([0, $('svg').attr("height")]);

    var xScale = d3.scale.ordinal()
        .domain(d3.range(bands))
        .rangeRoundBands([0, $('svg').attr("width") - (2 * 30)], 0.05);

    current_scale['x'] = xScale;
    current_scale['y'] = yScale;
  };

   var scaleBars = function(bars, bands) {

        bars.attr("x", function(d, i) {
                return current_scale.x(i);
            })
            .attr("y", function(d) {
                return $('svg').attr("height") - current_scale.y(d.tweets.length);
            })
            .attr("width", current_scale.x.rangeBand())
            .attr("height", function(d) {
                return current_scale.y(d.tweets.length);
            });
  };

 var scaleText = function(text, bands) {


        text.attr("x", function(d, i) {
            return current_scale.x(i) + current_scale.x.rangeBand() / 2;
           })
           .attr("y", function(d) {
                return $('svg').attr("height") - current_scale.y(d.tweets.length) + 14;
           });
  };


  ByHour.resizeGraph = function() {

        setScale(ByHour.current_dataset, ByHour.current_bands);

        var bars = svg.selectAll("rect").data(ByHour.current_dataset);
        scaleBars(bars.transition().duration(1), ByHour.current_bands);

        //var text = svg.selectAll("text").data(dataset);
        //scaleText(text, bands);
  };


  var getEmptyRecord = function(id) {
    return { id: [] };
  };

  var cleanedDataset = function(dataset, bands, utc_offset) {

    var hour_map = _.groupBy(dataset, function(d) {
      return Timehelper.bucketGivenNChunks(new Date(d['created_at']).getTime(), bands, utc_offset);
    })

    _.each(_.range(bands), function(i) {
      if (!_.has(hour_map, i)) {
        hour_map[i] = [];
      }
    });

    var new_dataset = [];

    _.each(_.pairs(hour_map), function(pair) {
      new_dataset[pair[0]] = {'time': pair[0], 'tweets': pair[1]};
    });

    return new_dataset;
  };

  ByHour.initializeGraph = function(this_svg) {


    if (initialized) {
        return;
    }

    initialized = true;

    svg = this_svg;

    var bands = DEFAULT_BANDS;
    var utc_offset = DEFAULT_UTC_OFFSET;

    ByHour.current_bands = bands;

    $.getJSON('/tweets/', function(ds) {

        current_dataset = cleanedDataset(ds, bands, utc_offset);

        ByHour.current_dataset = current_dataset;

        var key = function(d) {
            return d.time;
        };

        setScale(current_dataset, bands);

        scaleBars(svg.selectAll("rect")
           .data(current_dataset, key)      //Bind data with custom key function
           .enter()
           .append("rect")
           .attr("fill", function(d) {
                var height = $('svg').attr("height");
                return getFillStyle(current_scale.y(d.tweets.length) / height);
            })
           .on("mouseover", function(d) {
                d3.select(this)
                  .transition(1000)
                  .attr("fill", getFillStyle(current_scale.y(d.tweets.length) / $('svg').attr("height"), 1));

                //Get this bar's x/y values, then augment for the tooltip
                var xPosition = parseFloat(d3.select(this).attr("x")) + current_scale.x.rangeBand() / 2;
                var yPosition = Math.max(0, parseFloat(d3.select(this).attr("y")) - 40);

                //Update the tooltip position and value
                d3.select("#tooltip")
                  .style("left", xPosition + "px")
                  .style("top", yPosition + "px")
                  .select("#value")
                  .text(d.time + ":00 had " + d.tweets.length + " tweets.");

                //Show the tooltip
                d3.select("#tooltip").classed("hidden", false);
           })
           .on("mouseout", function(d) {
                d3.select(this)
                  .transition(1000)
                  .attr("fill", getFillStyle(current_scale.y(d.tweets.length) /  $('svg').attr("height")));

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


  return ByHour;
});
