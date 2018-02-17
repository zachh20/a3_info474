$(function () {
    //create window for viz
    var margin = { top: 20, right: 20, bottom: 40, left: 60 },
        width = +800 - margin.left - margin.right,
        height = +650 - margin.top - margin.bottom

    //create color array to be matched to major categories
    //No packages available with 15 colors so had to hard code :(
    var colors = ['#00bfff', '#ff8000',  '#ff0000', '#ffff00', '#778899', '#0000ff', '#00ffbf', '#ffbf00', '#00ffff', '#808000','#80ff00' , '#8000ff', '#B8860B', '#ff00bf', '#000000']

    //create svg element and setting margins
    var svg = d3.select("svg")
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //main function, pass in our csv data
    d3.csv('data.csv', function (data) {
        
        var body = d3.select('body')

        //calls the method to draw the viz
        drawVis(data)

        //this function handles when the drop down menu is changed
        function onchange() {
            var majorCat = d3.select('select').property('value')
            filterType(majorCat);
        }

        //this is triggered when the dropdown menu is changed and calls the function to handle it
        $("select").change(function () {
           onchange();
        })

        //these lines of code create an array of all the unique major categories
        var categories = d3.map(data, function(d, i) {return data[i].Major_category;})
        var catArray = categories.keys()

        //this function matches the major category to it's corresponding color
        function colorMatcher(majorCategory) {
            //Had to re initlialze variables because they were undefined otherwise
            var categories = d3.map(data, function(d, i) {return data[i].Major_category;})
            var catArray = categories.keys()
            return colors[ catArray.indexOf(majorCategory)]
        }

        // For legend
        var cValue = function (d) { return data["Major_category"]; },
                color = d3.scaleOrdinal(d3.schemeCategory10);

        // draw legend
        function drawLegend() {
            
            //creates the legend elements
            var legend = svg.selectAll(".legend")
                .data(catArray)
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) { return "translate(0" + "," + i * 25 + ")"; });

            // draw legend colored rectangles
            legend.append("rect")
                .attr("x", width - 50)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", function(d, i) {return colors[i]});

            // draw legend text
            legend.append("text")
                .attr("x", width - 60)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (d, i) {return catArray[i]; })
        }

        //calls the method to initially create legend
        drawLegend();

        //this function filters the data according a major category and then redraws the vis with
        // only that data. If it is for all major categories then it also redraws the legend
        function filterType(mtype) {
            if (mtype == 'none') {  
                drawVis(data);
                drawLegend()
            } else {
                var ndata = data.filter(function (d, i) {
                    return data[i].Major_category == mtype;
                });
                drawVis(ndata)
            }
        }

        //this functions draws the vis
        function drawVis(newdata) {

            //create the xscale based on the data
            var xScale = d3.scaleLinear()
                .domain([0, d3.max(newdata, function (d, i) { return newdata[i].FullTimeUnemploymentRate })])
                .range([0, width]);
            
            //create the yscale based on the data
            var yScale = d3.scaleLinear()
                .domain([30000, d3.max(newdata, function (d, i) { return newdata[i].Median })])
                .range([height, 0]);
            
            //creates tooltip element
            var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            //clears out any circles leftover from a previous view
            svg.selectAll('circle').remove();
            
            //creates circle elements for each datapoint
            var circles = svg.selectAll("circle")
                .data(newdata);

            //renders the circles at the specific x and y and with the specific color
            // to match their major category   
            circles
                .enter().append("circle")
                .attr("cx", function (d, i) { return xScale(newdata[i].FullTimeUnemploymentRate); })
                .attr("cy", function (d, i) { return yScale(newdata[i].Median); })
                .attr("r", 7)
                .style("fill", function (d, i) {  return colorMatcher(newdata[i].Major_category); })
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
            
            //creates axis labels
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
                
            //clears out the old axis from any previous views
            svg.selectAll('g')
            .remove();
            
            //renders axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale));
            svg.append("g")
                .call(d3.axisLeft(yScale));
        }
    })
})