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

    // Function to update the chart
    function updateChart() {
        // Update xScale with the new dataset length
        xScale.domain(d3.range(dataset.length));

        // Bind data to the bars
        var bars = svg.selectAll("rect")
            .data(dataset);

        // Enter new bars
        bars.enter()
            .append("rect")
            .attr("x", function (d, i) {
                return xScale(i);
            })
            .attr("y", h)  // Start bars at bottom of the chart
            .attr("width", xScale.bandwidth())
            .attr("height", 0) // Start height from 0
            .merge(bars) // Merge new data with existing bars
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
                return "rgb(" + (d * 10) + "," + (255 - d * 10) + ", 100)";
            });

        // Remove bars that are no longer needed
        bars.exit()
            .transition()
            .duration(500)
            .attr("x", w) // Move exiting bars out of view
            .remove();

        // Update text labels
        var labels = svg.selectAll("text")
            .data(dataset);

        // Enter new labels
        labels.enter()
            .append("text")
            .merge(labels) // Merge new data with existing labels
            .transition()
            .duration(500)
            .text(function (d) {
                return d;
            })
            .attr("x", function (d, i) {
                return xScale(i) + xScale.bandwidth() / 2;
            })
            .attr("y", function (d) {
                return h - yScale(d) + 15;
            })
            .attr("fill", "black")
            .attr("text-anchor", "middle");

        // Remove labels for removed data
        labels.exit().remove();
    }

    // Button click event to ADD new data to the dataset
    d3.select("#addData").on("click", function () {
        var maxValue = 25;

        // Generate a new random number and ADD it to the dataset
        var newNumber = Math.floor(Math.random() * maxValue);
        dataset.push(newNumber); // Add the new number to the dataset

        // Update the chart with the updated dataset
        updateChart();
    });

    // Button click event to REMOVE data from the dataset
    d3.select("#removeData").on("click", function () {
        // Remove the first element from the dataset
        if (dataset.length > 0) {
            dataset.shift(); // Remove the first element from the dataset
        }

        // Update the chart with the updated dataset
        updateChart();
    });

    // Initial chart rendering
    updateChart();
}

window.onload = init;
