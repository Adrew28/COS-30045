function init() {
    var w = 600;
    var h = 300;
    var padding = 60;

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w + padding * 2)
        .attr("height", h + padding * 2)
        .append("g")
        .attr("transform", "translate(" + padding + "," + padding + ")");

    // Reading the data from CSV file
    d3.csv("Unemployment_78-95.csv", function(d) {
        return {
            date: new Date(+d.year, (+d.month - 1)), // Adjust for 0-based month index in JS
            number: +d.number
        };
    }).then(function(data) {
        dataset = data;
        lineChart(dataset);
    });
    console.table(dataset, ["date", "number"]);

    function lineChart(dataset) {

        var xScale = d3.scaleTime()
            .domain([d3.min(dataset, function(d) { return d.date; }), d3.max(dataset, function(d) { return d.date; })])
            .range([0, w]);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, function(d) { return d.number; })])
            .range([h, 0]);

        // Define the line generator
        var line = d3.line()
            .x(function(d) { return xScale(d.date); })
            .y(function(d) { return yScale(d.number); });

        var area = d3.area()
            .x(function(d) { return xScale(d.date); })
            .y0(yScale(0))  // Set the base line for the area
            .y1(function(d) { return yScale(d.number); });

        // Append the area to the SVG
        svg.append("path")
            .datum(dataset)
            .attr("class", "area")
            .attr("d", area)
            .attr("fill", "slategrey");

        // Append the line to the SVG
        svg.append("path")
            .datum(dataset)
            .attr("class", "line")
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", "slategrey")
            .attr("stroke-width", 2);

        // Add x-axis
        var xAxis = d3.axisBottom(xScale);
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + h + ")")
            .call(xAxis);

        // Add y-axis
        var yAxis = d3.axisLeft(yScale);
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        // Add a line for the half-million unemployment marker
        svg.append("line")
            .attr("class", "line halfMilMark")
            .attr("x1", 0)
            .attr("y1", yScale(500000))
            .attr("x2", w)
            .attr("y2", yScale(500000))
            .attr("stroke", "red")
            .attr("stroke-dasharray", "4 4");

        // Add a label for the half-million unemployment marker
        svg.append("text")
            .attr("class", "halfMilLabel")
            .attr("x", 10)
            .attr("y", yScale(500000) - 7)
            .text("Half a million unemployed")
            .attr("fill", "red");
    }
}

window.onload = init;
