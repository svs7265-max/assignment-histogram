//margins, width, and height of the chart
const margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//create the chart
let chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//scale of x axis
let x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1);

//scale of y axis
let y = d3.scale.linear()
    .range([height, 0]);

//define axes
let xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

let yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

let bardata = [];

// toggles for sorting direction
let sortYAsc = true;
let sortXAsc = true;

// BONUS tooltip (simple div)
let tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("background", "white")
  .style("border", "1px solid #999")
  .style("padding", "6px 10px")
  .style("border-radius", "6px")
  .style("pointer-events", "none")
  .style("opacity", 0);

d3.tsv("histogram_data.tsv", type, function(error, data) {
    if (error) {
      console.log(error);
      return;
    }

    bardata = data;

    //set domains
    x.domain(bardata.map(function(d) { return d.name; }));
    y.domain([0, d3.max(bardata, function(d) { return d.number; })]);

    //x axis (SAVE AS VARIABLE for updates)
    let xAxisG = chart.append("g")
       .attr("class", "xaxis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);

    //y axis
    let yAxisG = chart.append("g")
       .attr("class", "yaxis")
       .call(yAxis);

    //building bars (give them a key: name)
    let bars = chart.selectAll(".bar")
        .data(bardata, function(d){ return d.name; })
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("y", function(d) { return y(d.number); })
        .attr("height", function(d) { return height - y(d.number); })
        .attr("width", x.rangeBand())
        // BONUS tooltip events
        .on("mouseover", function(d) {
          tooltip.style("opacity", 1)
            .html("<b>X:</b> " + d.name + "<br><b>Y:</b> " + d.number);
        })
        .on("mousemove", function() {
          tooltip
            .style("left", (d3.event.pageX + 12) + "px")
            .style("top", (d3.event.pageY + 12) + "px");
        })
        .on("mouseout", function() {
          tooltip.style("opacity", 0);
        });

    // UPDATE FUNCTION: reorders bars + x-axis with animation
    function update() {
      // update x domain based on current bardata order
      x.domain(bardata.map(function(d){ return d.name; }));

      // animate bars moving to new x positions
      chart.selectAll(".bar")
        .data(bardata, function(d){ return d.name; })
        .transition()
        .duration(800)
        .attr("x", function(d){ return x(d.name); });

      // animate x axis to new order
      xAxisG.transition()
        .duration(800)
        .call(xAxis);
    }

    // CLICK ZONE 1: left of Y axis sorts by Y (number)
    chart.append("rect")
      .attr("x", -margin.left)     // left margin area
      .attr("y", 0)
      .attr("width", margin.left)
      .attr("height", height)
      .attr("fill", "transparent")
      .style("cursor", "pointer")
      .on("click", function() {
        sortYAsc = !sortYAsc;

        bardata.sort(function(a, b) {
          return sortYAsc ? d3.ascending(a.number, b.number)
                          : d3.descending(a.number, b.number);
        });

        update();
      });

    // CLICK ZONE 2: below X axis sorts by X (name)
    chart.append("rect")
      .attr("x", 0)
      .attr("y", height)           // below plot area
      .attr("width", width)
      .attr("height", margin.bottom)
      .attr("fill", "transparent")
      .style("cursor", "pointer")
      .on("click", function() {
        sortXAsc = !sortXAsc;

        bardata.sort(function(a, b) {
          return sortXAsc ? d3.ascending(a.name, b.name)
                          : d3.descending(a.name, b.name);
        });

        update();
      });
});

//function to process numerical data
function type(d) {
    d.number = +d.number; // coerce to number
    return d;
}
