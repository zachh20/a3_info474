var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = +400- margin.left - margin.right,
height = +400 - margin.top - margin.bottom

var svg = d3.select("svg")
    .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");



var xScale = d3.scaleLinear()
.domain([0, d3.max(dataset, function(d) { return d[0]})])
.range([0,width]);

var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) { return d[1]})])
    .range([height,0]);

d3.csv('data.csv', function(data) {
    console.log(data[0]);
});

svg.selectAll("circle") 
    .data(dataset)  
    .enter().append("circle")
    .attr("cx", function(d) { return xScale(d[0]); })  
    .attr("cy", function(d) { return yScale(d[1]); }) 
    .attr("r", 10);


