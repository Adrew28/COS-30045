var w = 600;
var h = 400;
var padding = 40;

var dataset = [
    [2,8],
    [3,5],
    [5,17],
    [6,6],
    [6,12],
    [7,20],
    [8,22],
    [10,11],
    [5,12],
    [6,16],
    ];
  
var xScale = d3.scaleLinear()
    .domain([d3.min(dataset, function(d) {
            return d[0];
        }) - 2,
        d3.max(dataset, function(d) {
            return d[0];
        }) + 5
    ])
    .range([padding, w - padding]);

var yScale = d3.scaleLinear()
    .domain([d3.min(dataset, function(d) {
            return d[1];
        }) - 5,
        d3.max(dataset, function(d) {
            return d[1];
        }) + 10
    ])
    .range([h - padding, padding]);  // Inverted range

var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

var xAxis = d3.axisBottom()
            .ticks(5)
            .scale(xScale);
                
svg.append("g")
    .attr("transform", "translate(0, "+ (h - padding) +")")
    .call(xAxis);

var yAxis = d3.axisLeft()
            .ticks(5)
            .scale(yScale);

svg.append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

// X-axis label
svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", w / 2)
    .attr("y", h - 5)
    .text("Tree Age (year)");

// Y-axis label
svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", 15)
    .attr("x", -h / 2)
    .text("Tree Height (cm)");

svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
        return xScale(d[0]);
    })
    .attr("cy", function(d) {
        return yScale(d[1]);
    })
    .attr("r", 5)
    .attr("fill", function(d) {
        if (d[0] === 500 && d[1] === 90) {
            return "red";   //  Set the color to red for [500,90]
        } else {
            return "slategrey";
        }
        });
                    

svg.selectAll(".text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) {
        return d[0] + "," + d[1];
        })
    .attr("x", function(d) {
        return xScale(d[0]) + 5;
        })
    .attr("y", function(d) {
        return yScale(d[1]) - 5;
        });