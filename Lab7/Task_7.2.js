function init() {

    var w = 300;
    var h = 300;

    var dataset = [5,10,18,30,12,25];

    var svg = d3.select("svg")
                .attr("width", w)
                .attr("height", h)

    var outerRadius = w / 2;
    var innerRadius = 0; 

    var arc = d3.arc()
                .outerRadius(outerRadius)
                .innerRadius(innerRadius);
    
    var pie = d3.pie();

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var arcs = svg.selectAll("g.arc")
                    .data(pie(dataset))
                    .enter()
                    .append("g")
                    .attr("class", "arc")
                    .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("d", function(d, i) {
            return arc(d,i);
        });
                
    arcs.append("text")
        .text(function(d) {
            return d.data;
        })
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .style("text-anchor", "middle");

}
window.onload = init;