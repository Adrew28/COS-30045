function init() {

    var w = 500;
    var h = 150;
    var barPadding = 3;
    
    var dataset = [24,10,29,19,8,15,25,12,9,6,21,28];
    
     // Scale for the x-axis (ordinal, based on the number of bars)
    var xScale = d3.scaleBand()
                   .domain(d3.range(dataset.length))    
                   .rangeRound([0, w])  // Map the dataset to the width of the SVG
                   .paddingInner(0.05); // Add padding between bars
    
    // Scale for the y-axis (linear, based on the dataset values)
    var yScale = d3.scaleLinear()
                   .domain([0, d3.max(dataset)])
                   .range([0, h]);  // Maps values to the height of the SVG
    
    var svg = d3.select("#chart")
                .append("svg")
                .attr("width", w)
                .attr("height", h);
    
    // Button click event to generate new data and update chart
    d3.select("#update")
        .on("click", function() {
            var numValues = dataset.length;
            var maxValue = 25;
    
            // Generate a new random dataset
            dataset = [];
            for (var i = 0; i < numValues; i++) {
                var newNumber = Math.floor(Math.random() * maxValue);   // Generate random Value
                dataset.push(newNumber); 
            }
    
            // Update the bars
            svg.selectAll("rect")
               .data(dataset)   // Bind new data to the existing bars
               .attr("x", function(d, i) { 
                   return xScale(i);    // Recalculate the x position for each bar
               })
               .attr("y", function(d) {
                   return h - yScale(d);  
               })
               .attr("width", xScale.bandwidth())
               .attr("height", function(d){        
                   return yScale(d);                 
               })
               .attr("fill", function(d) {
                   return "rgb(" + (d * 10) + "," + (255 - d * 10) + ", 100)";  // Update color based on data
               });
    
            // Update the text labels
            svg.selectAll("text")
               .data(dataset)
               .text(function(d){
                   return d;    // Display the new value
               })
               .attr("x", function(d, i){
                   return xScale(i) + xScale.bandwidth() / 2;
               })
               .attr("y", function(d){
                   return h - yScale(d) + 15; 
               });
        });
    
    // Initial bar chart creation
    svg.selectAll("rect")
       .data(dataset)
       .enter()
       .append("rect")
       .attr("x", function(d, i) { 
           return xScale(i); 
       })
       .attr("y", function(d) {
           return h - yScale(d);
       })
       .attr("width", xScale.bandwidth())
       .attr("height", function(d) {
           return yScale(d);
       })
       .attr("fill", function(d) {
           return "rgb(" + (d * 10) + "," + (255 - d * 10) + ", 100)";  // Set color based on the value
       });
    
    // Initial text labels creation
    svg.selectAll("text")
       .data(dataset)
       .enter()
       .append("text")
       .text(function(d) {
           return d;    // Display the value of the data point
       })
       .attr("x", function(d, i) {
           return xScale(i) + xScale.bandwidth() / 2;
       })
       .attr("y", function(d) {
           return h - yScale(d) + 15;
       })
       .attr("fill", "black")   // Set the text color
       .attr("text-anchor", "middle");  // Center the text within each bar
    
}

window.onload = init;