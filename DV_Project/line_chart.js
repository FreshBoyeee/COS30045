function init(){
    var w = 1000;
    var h = 300;
    var padding = 50;
    var padding1 = 50;
    var average = 16159.71429;
    // data bind Date_of_event
    var parseDate = d3.timeFormat("%Y-%m-%dT%H:%M:%SZ");
    var dateFormat = d3.timeFormat("%Y-%m-%d"); //Time conversion format
    d3.csv("AUS_disasters_cleanup.csv", function (d) {
        const date = new Date(d.Date_of_event);
        return {
            time: dateFormat(date),
            year: new Date(dateFormat(date)),
            number: Number(d.Disaster_Internal_Displacements)
        };
    }).then(function (data) { //sort
        lineChart(data.sort((a, b) => { //sorting the year in ascending order
            if (a.time < b.time) {
                return -1;
            } else if (a.time > b.time) {
                return 1;
            } else {
                if (a.number < b.number) {
                    return 1;
                } else if (a.number > b.number) {
                    return -1;
                } else {
                    return 0;
                }
            }
        }));
    });

    function lineChart(dataset) {
        var svg = d3.select("#line_chart").append("svg").attr("width", w).attr("height", h);
        // Step 2: Set up the Scales 
        var xScale = d3.scaleTime().domain(d3.map(JSON.parse(JSON.stringify(d3.extent(dataset, d => d.year))), (d, i) => {
            var newDate = new Date(d)
            if (i < 1) {
                return  newDate.setFullYear((newDate.getFullYear()-1))
            } else {
                return newDate.setFullYear((newDate.getFullYear()+1))
            }
        })).range([padding, w - padding])

        var yScale = d3.scaleLinear().domain([0, d3.max(dataset, d => d.number)]).nice().rangeRound([h - padding, padding]);

        var xAxis = d3.axisBottom(xScale).ticks(w / 50)

        var yAxis = d3.axisLeft(yScale).ticks(5)

        // Step 3: Set up the line
        var line = d3.line()
            .x(function (d, i) {
                return xScale(d.year);
            })
            .y(function (d) {
                return yScale(d.number);
            }).curve(d3.curveCatmullRom.alpha(0.5))

        //  Step 4: Set up the SVG and Path
        svg.append('path').attr('d', line(dataset)).attr('stroke', 'black').attr('fill', 'none')

        const tooltip = d3.select(document.createElement("div")).attr('class', "tooltip");
        document.body.appendChild(tooltip.node())

        svg.append('g').selectAll('circle').data(dataset)
            .enter().append('circle')
            .attr('cx', function (d, i) {
                return xScale(d.year);
            })
            .attr('cy', function (d, i) {
                return yScale(d.number);
            })
            .attr('r', 2.5)
            .attr('fill', 'red')
            .on("mouseenter", function (d) {
                tooltip.style("opacity", 1).html(`<b style="color: #fff">date:${dateFormat(d.target.__data__.year)}</b><br/><b style="color: #fff">Disaster_Internal_Displacements:${d.target.__data__.number}</b>`)
                let {offsetX: x, offsetY: y} = d;
                y -= 10
                // x = 0 as initial
                x -= tooltip._groups[0][0].clientWidth/2
                if (x < padding + 10) {
                    x += 100;
                }
                tooltip
                    .style("left", x + "px")
                    .style("top", y + "px")
            })
            .on("mouseleave", function (e) {
                tooltip.style("opacity", 0)
            })
        ////////////////////////////axises
        //  add x and y axises
        svg.append("g")
            .attr("class", "axis") //Assign "axis" class
            .attr("transform", "translate(0," + (h - padding1) + ")")
            .call(xAxis);

        //  Add the Y-axis
        svg.append("g")
            .attr("class", "axis") //Assign "axis" class to CSS
            .attr("transform", "translate(" + padding + ")")
            .call(yAxis);

        // Step 5: Add some annotations
        svg.append("line")
            .attr("class", "line halfMilMark")
            // start of line
            .attr("x1", padding)
            .attr("y1", yScale(average))
            // end of line
            .attr("x2", w - padding)
            .attr("y2", yScale(average));

        svg.append("text")
            .attr("class", "halMilLabel")
            .attr("x", padding + 10)
            .attr("y", yScale(average) - 7)
            .text("Average");
    }
}
window.onload = init;