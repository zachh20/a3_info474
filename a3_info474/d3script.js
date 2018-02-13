
var margin = {top: 20, right: 20, bottom: 20, left: 60},
    width = +800- margin.left - margin.right,
    height = +650 - margin.top - margin.bottom

var col = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("svg")
    .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv('data.csv', function(data){
    var body = d3.select('body')
    var selectedData = []
    for (var i = 0; i < data.length; i++){
        selectedData.push([data[i].FullTimeUnemploymentRate, data[i].Median])
    }

    var mouseData = [] 
    for (var i = 0; i < data.length; i++){
        mouseData.push(["Unemployment Rate: " + data[i].FullTimeUnemploymentRate,
                        "Median Salary: " + data[i].Median, 
                        "Major Category: " + data[i].Major_category, 
                        "Major: " + data[i].Major])
    }

	var xScale = d3.scaleLinear()
		.domain([0, d3.max(selectedData, function(d) { return d[0]})])
		.range([0,width]);

	var yScale = d3.scaleLinear()
		.domain([0, d3.max(selectedData, function(d) { return d[1]})])
		.range([height,0]);

    var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

	svg.selectAll("circle") 
		.data(selectedData)  
		.enter().append("circle")
		.attr("cx", function(d) { return xScale(d[0]); })  
		.attr("cy", function(d) { return yScale(d[1]); }) 
		.attr("r", 10)
        .style("fill", function(d, i) {console.log(data[i].Major_category); return col(data[i].Major_category); })
        .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html(mouseData[selectedData.indexOf(d)])	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);
        });

     svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

      svg.append("g")
       .call(d3.axisLeft(yScale));

	circles = svg.selectAll("circle") 
		.data(selectedData) 
		.attr("fill","black") 
		.attr("r",3);

})
    
