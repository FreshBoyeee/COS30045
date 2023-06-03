function init(){
    // 1. canvas
    var body = d3.select("#bar_chart");
    var w = 600; //width
    var h = 400; // height
    var svg = body.append("svg")
                .attr("width", w)
                .attr("height", h);
        svg=svg.append('g')
    var padding = 40;

    //Sets the parameters for sorting
    let sortOption=0
    //function: which sorts the data and according to different parameters, return the data
    let sortDataWithOption=function(data,option){
        if(option==0)//sort by year
            return d3.sort(data,d=>d[0])

        if(option==1)//ascending sort
            return d3.sort(data,(a,b)=>d3.ascending(a[2],b[2]))

        if(option==2)//descending sort
            return d3.sort(data,(a,b)=>d3.descending(a[2],b[2]))
    }

    //load data
    d3.csv("AUS_disasters_cleanup.csv").then(data=>{
        //Group the data by years to calculate the individual years
        let dataGroupByYear=d3.groups(data,d=>d.Year) //grouping function
        dataGroupByYear.forEach(e => {
            let sum=0
            e[1].forEach(d=>{
                sum+=+d.Disaster_Internal_Displacements
            })
            e[2]=sum
        });
        //result of the sum
        console.log(dataGroupByYear)
        
        //function: defining and draw bars; pass them into the sorted data and draw the graph internally
        let drawBarFromData=function(dataSorted){
                
        // 3.Scale 
        var xScale = d3.scaleBand() //ordinal -categorical scale
                    //x-axis using years as the domain
                    .domain(dataSorted.map(d=>d[0]))
                    .range([padding, w -padding])
                    .paddingInner(0.1); 
        
        var yScale = d3.scaleLinear()
                    //calculating the range of y-axis data via extent.
                    .domain(d3.extent(dataSorted,d=>d[2])) //
                    .range([h- padding, padding]);

        // // 3. Bar chart
        var rects = svg.selectAll("rect") 
                        .data(dataSorted)
                        .enter()
                        .append("rect")
                        .attr("x", function(d, i) {  
                            return xScale(d[0]);
                        })
                        .attr("y", function(d) {
                            return yScale(d[2]);
                        })
                        .attr("width", xScale.bandwidth())
                        .attr("height", function(d) {
                            return h - yScale(d[2]); 
                        }) 
                        .attr("fill", "slategrey")
                        //mouse control
                        .on("mouseover", function(event, d) {
                            d3.select(this)
                                .attr("fill", "orange")
                            let tooltipid='#tooltip_'+d[0]
                            d3.select(tooltipid).style('display','')
                        })
                        .on("mouseout", function(event,d) {
                            d3.select(this)
                                .transition()
                                .delay(2)
                                .attr("fill", "slategrey")
                            //the original position is restored, after the mouse is moved out
                            let tooltipid='#tooltip_'+d[0]
                            d3.select(tooltipid).style('display','none')
                        });

        //add the text of year 
        var texts = svg.selectAll(".MyText")
                .data(dataSorted)
                .enter()
                .append("text")
                .attr("class","MyText")
                // Use scale directly to calculate the text position
                .attr("x", function(d,i){
                    return xScale(d[0])+xScale.bandwidth()/5;
                })
                .attr("y", function(d){
                    return h-15;
                })
                .style('font-size','.6em')
                .text(function(d){
                    return d[0];
                });
        
        // add the number of displacements each year
        var tooltip = svg.selectAll(".tooltip1")
                .data(dataSorted)
                .enter()
                .append("text")
                .attr('class','tooltip1')
                .attr("id",d=>"tooltip_"+d[0])
                .attr("x", function(d,i){
                    return xScale(d[0]);
                })
                .attr("y", function(d){
                    return yScale(d[2]);
                })
                .style('font-size','15px')
                .style('fill', 'white')
                .style("font-weight", "bold")
                .style('display',"none")
                .text(function(d){
                    return d[2];
                });

        }//end of function

        // Default output graph
        drawBarFromData(sortDataWithOption(dataGroupByYear,sortOption))
        // To add click event listener to the sort button and redraw the graph after it's clicked
        d3.select('.original')
            .on('click',d=>{
                sortOption= 0
                //clear svg
                d3.select('svg').select('g').remove()
                svg=d3.select('svg').append('g')

                //Call the defined function to redraw the graph
                drawBarFromData(sortDataWithOption(dataGroupByYear, sortOption))
            })

        d3.select('.ascending')
            .on('click',d=>{
                sortOption= 1
                //clear svg
                d3.select('svg').select('g').remove()
                svg=d3.select('svg').append('g')

                //Call the defined function to redraw the graph
                drawBarFromData(sortDataWithOption(dataGroupByYear, sortOption))
            })
        d3.select('.descending')
            .on('click',d=>{
                sortOption= 2
                //clear svg
                d3.select('svg').select('g').remove()
                svg=d3.select('svg').append('g')

                //Call the defined function to redraw the graph
                drawBarFromData(sortDataWithOption(dataGroupByYear, sortOption))
            })
    })
            
    // }
}
window.onload = init;