function init(){
    d3.csv("AUS_disasters_cleanup.csv").then(function(data) {

        var svg = CreatSVG();

        var selectedYear = "2018";

        var dropdown = document.getElementById("yearDropdown");

        dropdown.addEventListener("change", function() {
            selectedYear = dropdown.value;
            pieChart(data, selectedYear, svg);
        });
        pieChart(data, selectedYear, svg);
    })
    
    function pieChart(data, selectedYear, svg){
        var filteredData = data.filter(function(d) {
            return d.Year === selectedYear;
        });
    
        var groupedData = d3.group(filteredData, function(d) {
            return d.Hazard_Type;
        });
          
        var pieData = Array.from(groupedData, function([key, value]) {
            return { Hazard_Type: key, Displacements: d3.sum(value, function(d) { return d.Disaster_Internal_Displacements; }) };
        });

        var width = 500;
        var height = 500;
        var radius = Math.min(width, height) / 2;

        var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

        var pie = d3.pie()
        .value(function(d) { return d.Displacements; });

        // var svg = d3.select("body")
        // .append("svg")
        // .attr("width", width)
        // .attr("height", height)
        // .append("g")
        // .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var arcs = svg.selectAll("arc")
        .data(pie(pieData))
        .enter()
        .append("g");

        arcs.append("path")
        .attr("d", arc)
        .attr("fill", function(d) {
            if (d.data.Hazard_Type === "Flood") {
              return "#17D7FE";
            } else if (d.data.Hazard_Type === "Wildfire") {
              return "#F4690E";
            } else if (d.data.Hazard_Type === "Storm") {
              return "#B117FE";
            }
          });

        arcs.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("text-anchor", "middle")
        .text(function(d) { return d.data.Hazard_Type; });
    }

    function CreatSVG(){
        var width = 500;
        var height = 500;
        var svg = d3.select("body")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        return svg;
    }
}

window.onload = init;