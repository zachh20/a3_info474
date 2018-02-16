$(function () {
    var margin = { top: 20, right: 20, bottom: 40, left: 60 },
        width = +800 - margin.left - margin.right,
        height = +650 - margin.top - margin.bottom

    var col = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select("svg")
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv('data.csv', function (data) {
        var body = d3.select('body')
        drawVis(data)
 
        function onchange() {
            var majorCat = d3.select('select').property('value')
            filterType(majorCat);
            
        }

        $("select").change(function () {
           console.log("Changed value");
           onchange();
        })

        function filterType(mtype) {
            
            if (mtype == 'none') {
                console.log("myType = " + mtype)
                drawVis(data);
            } else {
                
                console.log("change")
                console.log(mtype)
                var ndata = data.filter(function (d, i) {
                    return data[i].Major_category == mtype;
                });
                console.log(ndata);
                drawVis(ndata)
            }
        }

        function drawVis(newdata) {
            console.log(newdata)
            var xScale = d3.scaleLinear()
                .domain([0, d3.max(newdata, function (d, i) { return newdata[i].FullTimeUnemploymentRate })])
                .range([0, width]);

            var yScale = d3.scaleLinear()
                .domain([30000, d3.max(newdata, function (d, i) { return newdata[i].Median })])
                .range([height, 0]);


            var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            svg.selectAll('circle').remove();
            
            var circles = svg.selectAll("circle")
                .data(newdata);
                
            circles
                .enter().append("circle")
                .attr("cx", function (d, i) { return xScale(newdata[i].FullTimeUnemploymentRate); })
                .attr("cy", function (d, i) { return yScale(newdata[i].Median); })
                .attr("r", 7)
                .style("fill", function (d, i) { return col(newdata[i].Major_category); })
                .on("mouseover", function (d, i) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html("Unemployment Rate: " + newdata[i].FullTimeUnemploymentRate + '<br />' +
                "Median Salary: " + newdata[i].Median + '<br />' +
                "Major Category: " + newdata[i].Major_category + '<br />' +
                "Major: " + newdata[i].Major)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function (d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                })

            svg.append("text")             
                .attr("transform",
                    "translate(" + (width/2) + " ," + 
                    (height + margin.top + 15) + ")")
                .style("text-anchor", "middle")
                .text("Unemployment Rate");

            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Median Salary (In dollars)");
  
            svg.selectAll('g')
            .transition()
            .duration(50)
            .remove();
            
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale));

            svg.append("g")
                .call(d3.axisLeft(yScale));
            
           

        }

    })

})