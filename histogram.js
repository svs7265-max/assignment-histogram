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
    
let testArray = [6,1,8,5,2,7,4,3,9];
let bardata=[];

d3.tsv("histogram_data.tsv", type, function(error, data) {

    //passing the data to bardata
    bardata = data;
    
    //defining the axes
    x.domain(bardata.map(function(d) { return d.name; }));
    y.domain([0, d3.max(bardata, function(d) { return d.number; })]);
    //x axis
    chart.append("g")
       .attr("class", "xaxis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);
    //y axis
    chart.append("g")
       .attr("class", "yaxis")
       .call(yAxis);

    //building bars
    chart.selectAll(".bar")
        .data(bardata)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("y", function(d) { return y(d.number); })
        .attr("height", function(d) { return height - y(d.number); })
        .attr("width", x.rangeBand())
});


//function to process numerical data 
function type(d) {
    d.number = +d.number; // coerce to number
    return d;
}