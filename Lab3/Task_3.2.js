//  Define chart width and height
var w = 600;
var h = 400;
var padding = 40;   //  Padding around the chart

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

//  Define the xScale using D3's scaleLinear
var xScale = d3.scaleLinear()
    .domain([d3.min(dataset, function(d) {
            return d[0];
        }) - 2,
        d3.max(dataset, function(d) {
            return d[0];
        }) + 5  //  Add extra padding
    ])
    .range([padding, w - padding]); //  Map ro chart width with padding

//  Define the yScale using D3's scaleLinear 
var yScale = d3.scaleLinear()
    .domain([d3.min(dataset, function(d) {
            return d[1];
        }) - 5,
        d3.max(dataset, function(d) {
            return d[1];
        }) + 10
    ])
    .range([h - padding, padding]);  // Inverted range

// Create an SVG element inside the body (or a div with specific ID)
var svg = d3.select("body")
    .append("svg")
    .attr("width", w)   //  Set the width of the SVG
    .attr("height", h); //  Set the height of the SVG

// Define and create the x-axis with ticks and the xScale
var xAxis = d3.axisBottom()
            .ticks(5)
            .scale(xScale);
                
svg.append("g")
    .attr("transform", "translate(0, "+ (h - padding) +")") // Position the axis
    .call(xAxis);

// Define and create the y-axis with ticks and the yScale
var yAxis = d3.axisLeft()
            .ticks(5)
            .scale(yScale);

svg.append("g")
    .attr("transform", "translate(" + padding + ",0)")  // Position the axis
    .call(yAxis);

// X-axis label
svg.append("text")
    .attr("text-anchor", "end") // Align text at the end
    .attr("x", w / 2)           // Center the label horizontally
    .attr("y", h - 5)           // Position near the bottom of the SVG
    .text("Tree Age (year)");   // Text for x-axis

// Y-axis label
svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")   // Rotate the label for vertical positioning
    .attr("y", 15)                      // Adjust vertical position of the label
    .attr("x", -h / 2)                  // Center the label on the y-axis
    .text("Tree Height (cm)");          // Text for y-axis

// Create circle elements for each data point in the dataset
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
                    
// Add text labels to each data point (x, y) above the circles
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