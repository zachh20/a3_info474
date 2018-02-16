$(function () {
    var margin = { top: 20, right: 20, bottom: 20, left: 60 },
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

        function drawVis(data) {
            
            var xScale = d3.scaleLinear()
                .domain([0, d3.max(data, function (d, i) { return data[i].FullTimeUnemploymentRate })])
                .range([0, width]);

            var yScale = d3.scaleLinear()
                .domain([30000, d3.max(data, function (d, i) { return data[i].Median })])
                .range([height, 0]);

            var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            
            var circles = svg.selectAll("circle")
                .data(data);
                
            circles
                .enter().append("circle")
                .attr("cx", function (d, i) { return xScale(data[i].FullTimeUnemploymentRate); })
                .attr("cy", function (d, i) { return yScale(data[i].Median); })
                .attr("r", 7)
                .style("fill", function (d, i) { return col(data[i].Major_category); })
                .on("mouseover", function (d, i) {
                    console.log(data[i].Major)
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html("Unemployment Rate: " + data[i].FullTimeUnemploymentRate + '<br />' +
                "Median Salary: " + data[i].Median + '<br />' +
                "Major Category: " + data[i].Major_category + '<br />' +
                "Major: " + data[i].Major)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function (d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                })

            svg.selectAll('g').remove();

            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale));

            svg.append("g")
                .call(d3.axisLeft(yScale));
            
           circles.exit().remove();

        }

    })

})