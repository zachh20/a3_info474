
var margin = {top: 20, right: 20, bottom: 20, left: 60},
    width = +800- margin.left - margin.right,
    height = +650 - margin.top - margin.bottom

var col = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("svg")
    .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv('data.csv', function(data){
    var body = d3.select('body')
    drawVis(data)


    
    var selectedData = []
    for (var i = 0; i < data.length; i++){
        selectedData.push([data[i].FullTimeUnemploymentRate, data[i].Median])
    }
        var mouseData = [] 
    for (var i = 0; i < data.length; i++){
        mouseData.push(["Unemployment Rate: " + data[i].FullTimeUnemploymentRate + '<br />' +
                        "Median Salary: " + data[i].Median + '<br />' +
                        "Major Category: " + data[i].Major_category + '<br />' +
                        "Major: " + data[i].Major])
    }


     d3.select("#selectform")
        .on('change', function(){
        var majorCat = document.getElementById('myselectform')
        console.log("changy boi is working");
        filterType(majorCat);
        console.log("changy boi is working");
    })

     function filterType(mtype){ 

        var res = patt.test(mtype);
        if(res && mtype == 'none'){
            drawVis(data);
        }else{
            var ndata = data.filter(function(d, i) {
                return data[i].Major_category == mtype;
            });
            drawVis(ndata)
        }
    }

   

   

    function drawVis(data) {
	var xScale = d3.scaleLinear()
		.domain([0, d3.max(data, function(d, i) { return data[i].FullTimeUnemploymentRate})])
		.range([0,width]);

	var yScale = d3.scaleLinear()
		.domain([30000, d3.max(data, function(d, i) { return data[i].Median})])
		.range([height,0]);

    var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

	svg.selectAll("circle") 
		.data(data)  
		.enter().append("circle")
		.attr("cx", function(d, i) { return xScale(data[i].FullTimeUnemploymentRate); })  
		.attr("cy", function(d, i) { return yScale(data[i].Median); }) 
		.attr("r", 7)
        .style("fill", function(d, i) { return col(data[i].Major_category); })
        .on("mouseover", function(d, i) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html(mouseData[i])	
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

	
    }

})
    
