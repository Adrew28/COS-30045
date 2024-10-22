function init() {

    var dataset = [
        { apples: 5, oranges: 10, grapes: 22 },
        { apples: 4, oranges: 12, grapes: 28 },
        { apples: 2, oranges: 19, grapes: 32 },
        { apples: 7, oranges: 23, grapes: 35 },
        { apples: 23, oranges: 17, grapes: 43 }
    ];

    var stack = d3.stack()
        .keys(["grapes", "oranges", "apples"]);  // Reverse the order for correct stacking

    var series = stack(dataset);

    var w = 400;
    var h = 300;

    var xScale = d3.scaleBand()
                    .domain(d3.range(dataset.length))
                    .range([0, w])
                    .padding(0.1);
    
    var yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset, function(d){
                        return d.apples + d.oranges + d.grapes;
                        })
                    ])
                    .range([h, 0]);

    var color = d3.scaleOrdinal()
                  .domain(["apples", "oranges", "grapes"])
                  .range(["#2ca02c", "#ff7f0e", "#1f77b4"]);  // Custom colors (green, orange, blue)

    var svg = d3.select("#chart")
                .append("svg")
                .attr("width", w)
                .attr("height", h);
    
    var groups = svg.selectAll("g.series")
                    .data(series)
                    .enter()
                    .append("g")
                    .style("fill", function(d, i) {
                        return color(color.domain()[i]);  // Using the color domain for legend
                    });
    
    var rects = groups.selectAll("rect")
                        .data(function(d) { return d; })
                        .enter()
                        .append("rect")
                        .attr("x", function(d, i ){
                            return xScale(i);
                        })
                        .attr("y", function(d, i) {
                            return yScale(d[1]);
                        })
                        .attr("height", function(d) {
                            return yScale(d[0]) - yScale(d[1]);
                        })
                        .attr("width", xScale.bandwidth());

    // Adding the legend
    var legend = svg.selectAll(".legend")
                    .data(color.domain())  // Correctly use the domain for legend items
                    .enter()
                    .append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) {
                        return "translate(50," + (i * 20) + ")";  // Positioning the legend on the right
                    });

    // Adding colored rectangles to the legend
    legend.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d) { return color(d); });  // Color by data key (apples, oranges, grapes)

    // Adding text labels to the legend
    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function(d) { return d; });  // Correct labels: apples, oranges, grapes

}
window.onload = init;
