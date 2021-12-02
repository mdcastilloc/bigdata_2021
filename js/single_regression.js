// set the dimensions and margins of the graph
const margin = {top: 100, right: 150, bottom: 0, left: 150},
    width = 860 - margin.left - margin.right,
    height = 860 - margin.top - margin.bottom,
    innerRadius = 90,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// append the svg object
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${width/2+margin.left}, ${height/2+margin.top})`);

d3.csv("https://raw.githubusercontent.com/sejeong7/singleregression/main/single_regression.csv").then( function(data) {

  const colourScale = d3.scaleOrdinal()
                        .domain(data, d => d.category)
                        .range(["#90278e", "#0087a4", "yellow", "#d6de23", "grey", "#ffdd00", "#fbb615", "#f6921e", "#ec1c24", "#eb008b"])

  // Scales
  const x = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0)                  // This does nothing
      .domain(data.map(d => d.variable_name)); // The domain of the X axis is the list of states.
  const y = d3.scaleRadial()
      .range([innerRadius, outerRadius])   // Domain will be define later.
      .domain([0, 3]); // Domain of Y is from 0 to the max seen in the data

//add circles
      var yAxis = svg.append("g")
          .attr("text-anchor", "end");

      var yTick = yAxis
                .selectAll("g")
                .data(y.ticks(3).slice(1))
                .enter().append("g");

              yTick.append("circle")
                  .attr("fill", "none")
                  .attr("stroke-width", "4px")
                  .attr("stroke", "#000")
                  .attr("opacity", 0.2)
                  .attr("r", y);


  // Add the bars
  svg.append("g")
    .selectAll("path")
    .data(data)
    .join("path")
      .attr("fill", d =>colourScale(d.category))
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(d => y(d['single_regression'])+2)
          .startAngle(d => x(d.variable_name))
          .endAngle(d => x(d.variable_name) + x.bandwidth())
          .padAngle(0.01)
          .padRadius(innerRadius))

  // Add the labels
  svg.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
        .attr("text-anchor", function(d) { return (x(d.variable_name) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((x(d.variable_name) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (285) + ",0)"; })
      .append("text")
        .text(function(d){return(d.variable_name)})
        .attr("transform", function(d) { return (x(d.variable_name) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle")

//circular labels
        yTick.append("text")
            .attr("y", function(d) { return -y(d); })
            .attr("dy", "0.35em")
            .attr("fill", "none")
            .attr("stroke", "#fff")
            .attr("stroke-width", 5)
            .text(y.tickFormat(5, "s"));

        yTick.append("text")
            .attr("y", function(d) { return -y(d); })
            .attr("dy", "0.35em")
            .text(y.tickFormat(5, "s"));

            .on("mouseover", function(event, d) {
                d3.select("#tooltip")
                        .style("left", event.pageX + "px")
                        .style("top", event.pageY + "px")
                    .select("#value")
                        // .html("<p>" + String(d[1]) + "</p>"); // access data by indexing array value
                        .html("<p>" + String(d.single_regression) + "</p>"); // access data by object property

                d3.select("#tooltip")
                    .classed("hidden", false);
            })
            .on("mouseout", function() {
                d3.select("#tooltip")
                    .classed("hidden", true);
            })


});
