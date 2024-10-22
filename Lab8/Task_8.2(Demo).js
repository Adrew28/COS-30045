function init() {
    // Set the width and height for the SVG canvas
    var w = 500;
    var h = 300;

    // Define the map projection using Mercator projection, centered and scaled for Victoria, Australia
    var projection = d3.geoMercator()
                        .center([145, -36.5]) // Coordinates for Victoria
                        .translate([w / 3, h / 2]) // Shift the map to fit within the SVG canvas
                        .scale(2450); // Scale to zoom in on the map of Victoria

    // Define a geographical path generator using the projection
    var path = d3.geoPath()
                .projection(projection);

    // Define a color scale (quantize) for the unemployment data with five color ranges
    var color = d3.scaleQuantize()
                .range(["#f7fbff", "#c6dbef", "#6baed6", "#2171b5", "#08306b"]);

    // Create the SVG element where the map will be drawn
    var svg = d3.select("#chart")
                .append("svg")
                .attr("width", w) // Set width
                .attr("height", h); // Set height

    // Set up the tooltip element for city data (hidden initially)
    var tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("position", "absolute")
                    .style("visibility", "hidden")
                    .style("background-color", "white")
                    .style("border", "1px solid black")
                    .style("padding", "5px")
                    .style("border-radius", "5px");

    // Load unemployment data from CSV
    d3.csv("VIC_LGA_unemployment.csv").then(function(data) {
        // Define the domain for the color scale based on the unemployment rates
        color.domain([
            d3.min(data, function(d) { return +d.unemployed; }), // Minimum unemployment rate
            d3.max(data, function(d) { return +d.unemployed; })  // Maximum unemployment rate
        ]);

        // Load GeoJSON data for Victorian LGAs (Local Government Areas)
        d3.json("https://raw.githubusercontent.com/Adrew28/COS-30045/refs/heads/main/Lab8/LGA_VIC.json").then(function(json) {
            // Merge CSV data with GeoJSON based on matching LGA names
            for (var i = 0; i < data.length; i++) {
                var dataLGA = data[i].LGA; // LGA name from the CSV
                var dataValue = parseFloat(data[i].unemployed); // Unemployment rate

                // Find the matching LGA in the GeoJSON and assign the unemployment rate
                for (var j = 0; j < json.features.length; j++) {
                    var jsonLGA = json.features[j].properties.LGA_name;
                    if (dataLGA === jsonLGA) {
                        json.features[j].properties.value = dataValue;
                        break;
                    }
                }
            }

            // Draw the map of Victoria, coloring each LGA based on unemployment rate
            svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path) // Use the path generator to create the LGA shapes
                .style("fill", function(d) {
                    var value = d.properties.value; // Unemployment rate
                    return value ? color(value) : "#ccc"; // Color by rate or grey if no data
                });

            // Load additional data for cities in Victoria
            d3.csv("VIC_city.csv").then(function(cityData) {
                // Add circles for each city based on its longitude and latitude
                svg.selectAll("circle")
                    .data(cityData)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d) {
                        return projection([d.lon, d.lat])[0]; // Calculate x position
                    })
                    .attr("cy", function(d) {
                        return projection([d.lon, d.lat])[1]; // Calculate y position
                    })
                    .attr("r", 5) // Radius of the circle
                    .style("stroke", "#000") // Black border
                    .style("stroke-width", 0.5)
                    .on("mouseover", function(event, d) {
                        tooltip.style("visibility", "visible")
                               .text(d.place); // Show city name on hover
                    })
                    .on("mousemove", function(event) {
                        tooltip.style("top", (event.pageY - 10) + "px") // Follow the mouse position
                               .style("left", (event.pageX + 10) + "px");
                    })
                    .on("mouseout", function() {
                        tooltip.style("visibility", "hidden"); // Hide tooltip when not hovering
                    });
            });
        });
    });
}

// Run the init function once the window loads
window.onload = init;
