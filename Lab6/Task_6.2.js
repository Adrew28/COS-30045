function init() {
    var w = 500;
    var h = 150;
    var barPadding = 3;

    var dataset = [24, 10, 29, 19, 8, 15, 25, 12, 9, 6, 21, 28];

    var xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .rangeRound([0, w])
        .paddingInner(0.05);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset)])
        .range([0, h]);

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    
    var ascending = true; //Toggle sorting order

    var sortBars = function() {
        ascending = !ascending;

        dataset.sort(function(a,b){
            if(ascending) {
                return d3.ascending(a,b);
            } else {
                return d3.descending(a,b);
            }
        });

         xScale.domain(d3.range(dataset.length));

        svg.selectAll("rect")
            .data(dataset) // Rebind sorted data
            .transition()
            .duration(500)
            .attr("x", function(d, i) {
                return xScale(i);
            })
            .attr("y", function(d) {
                return h - yScale(d);
            })
            .attr("height", function(d) {
                return yScale(d);
            });
    };

    d3.select("#sortData").on("click", function() {
        sortBars();
    });
    

    // Function to update the chart
    function updateChart() {
        xScale.domain(d3.range(dataset.length)); // Update xScale

        // Bind data to bars
        var bars = svg.selectAll(".bar")
            .data(dataset);

        // Enter new bars
        bars.enter()
            .append("rect")
            .attr("class", "bar") // Add class to differentiate bars
            .attr("x", function (d, i) {
                return xScale(i);
            })
            .attr("y", h) // Start at bottom
            .attr("width", xScale.bandwidth())
            .attr("height", 0) // Start height from 0
            .merge(bars) // Merge new and existing bars
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut) // Attach mouse events immediately
            .transition()
            .duration(500)
            .attr("x", function (d, i) {
                return xScale(i);
            })
            .attr("y", function (d) {
                return h - yScale(d);
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function (d) {
                return yScale(d);
            })
            .attr("fill", function (d) {
                return getColor(d);
            });

        // Remove exiting bars
        bars.exit()
            .transition()
            .duration(500)
            .attr("x", w) // Move exiting bars out of view
            .remove();
    }

    // Helper function to generate color based on data value
    function getColor(d) {
        return "rgb(" + (d * 10) + ", " + (255 - d * 10) + ", 100)";
    }

    // Mouseover handler (tooltip inside the top of the bar)
    function handleMouseOver(event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("fill", "orange");

        var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
        var yPosition = parseFloat(d3.select(this).attr("y")) + 15; // Tooltip just below the top of the bar

        // Append tooltip text inside the top of the bar
        svg.append("text")
            .attr("id", "tooltip")
            .attr("x", xPosition)
            .attr("y", yPosition) // Just inside the top of the bar
            .attr("text-anchor", "middle")
            .attr("font-weight", "bold")
            .attr("font-size", "12px")
            .attr("fill", "black")
            .text(d);
    }

    // Mouseout handler
    function handleMouseOut(event, d) {
        d3.select("#tooltip").remove(); // Remove tooltip
        d3.select(this)
            .transition()
            .duration(500)
            .attr("fill", getColor(d)); // Revert to original color
    }

    // Button click to add data
    d3.select("#addData").on("click", function () {
        var maxValue = 25;
        var newNumber = Math.floor(Math.random() * maxValue);
        dataset.push(newNumber); // Add new number to dataset
        updateChart();
    });

    // Button click to remove data
    d3.select("#removeData").on("click", function () {
        if (dataset.length > 0) {
            dataset.shift(); // Remove the first element
        }
        updateChart();
    });

    // Initial rendering
    updateChart();
}

window.onload = init;
