// below is needed to initializating the picture
// Set the dimensions of the canvas / graph
// right determins the space for writting things
var margin = {top: 30, right: 100, bottom: 100, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
// Parse the date / time
//var parseDate = d3.timeParse("%d-%b-%y");
//var key_mo=["mo0","mo1","mo2","mo3","mo4","mo5","mo6","mo7","mo8","mo9","mo10","mo11"];
var key_mo=["mo1","mo2","mo3","mo4","mo5","mo6","mo7","mo8","mo9","mo10","mo11"];
var key_temp=["tp12","tp2","tp21","tp32","tp35","tp4b","tp8a","tp9f","tpa3","tpc7","tpe5"];
//var key_temp=["tp4b"];
var active1=[];
var act_temp=[];
var legendSpace = width/ key_mo.length
var format = d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ')
// Set the ranges
var x_mo = d3.scaleTime().range([0, width]);
var y_mo = d3.scaleLinear().range([height, 0]);
var x_temp = d3.scaleTime().range([0, width]);
var y_temp = d3.scaleLinear().range([height, 0]);
//// Define the line for moisture
var valueline_mo=[];
key_mo.forEach(function(d,i) {
    valueline_mo[i]=d3.line()
        .x(function(d) { return x_mo(d.timestamp); })
        .y(function(d) { return y_mo(d[key_mo[i]]); });
})
//// Define the line for moisture
var valueline_temp=[];
key_mo.forEach(function(d,i) {
    valueline_temp[i]=d3.line()
        .x(function(d) { return x_temp(d.timestamp); })
        .y(function(d) { return y_temp(d[key_temp[i]]); });
})
// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");
var svg2 = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");
// below is to obtain the data
    var data1;
    //var url =   "https://data.sparkfun.com/output/JxO9ydlRjnuXARaZX5od.json"
    //var url =   "https://data.sparkfun.com/output/RMxqjA6nRXfbm01raooM.json"    // commercial data
    var url =   "https://data.sparkfun.com/output/8dojwRmX3jh0GDV99MlZ.json"    // baoping
    d3.json(url,  function (error,json) {
        if (error) return console.warn(error);
        json.forEach(function(d) {
            //d.timestamp = parseDate(format.parse(d.timestamp));
            //d.timestamp = format.parse(d.timestamp);
            d.timestamp = format(d.timestamp);
            //dataset.date = parseDate(d.date);
            //dataset.close = +d.close;
	    d.tp4b=d.tp4b/1.0;
        });
	 
    	data1=json;
    	console.log(data1)
 //       console.log(active1)
        x_mo.domain(d3.extent(data1, function(d) { return d.timestamp; }));
        //http://stackoverflow.com/questions/7538519/how-to-get-subarray-from-array 
        //x_mo.domain(d3.extent(data1.slice(1,1500), function(d) { return d.timestamp; }));
        y_mo.domain([200, d3.max(data1, function(d) { return d.mo10; })]);
        y_mo.domain([200, 550]);
        //y.domain([0, 30]);
//----------------below are moisture plottings---------------------- 
        //var color = d3.scaleOrdinal(d3.schemeCategory10);
        var color = d3.scaleOrdinal(d3.schemeCategory20);
        key_mo.forEach(function(d,i) {
            svg.append("path")
                .attr("class", "line")
                .style("stroke", color(key_mo[i]))
                .attr("d", valueline_mo[i](data1))
                .attr("id", 'tag'+key_mo[i].replace(/\s+/g, '')); // assign id **
            svg.append("text")
                .attr("x", (legendSpace/2)+i*legendSpace)  // space legend
                .attr("y", height + (margin.bottom/2)+ 5)
                .attr("class", "legend")    // style the legend
                .style("fill", color(key_mo[i]))
                .on("click", function(){                     // ************
                          // Determine if current line is visible 
                          var active   = active1[i] ? false : true,  // ************ 
                          newOpacity = active ? 0 : 1;             // ************
                          // Hide or show the elements based on the ID
                          d3.select("#tag"+key_mo[i].replace(/\s+/g, '')) // *********
                              .transition().duration(100)          // ************
                              .style("opacity", newOpacity);       // ************
                          // Update whether or not the elements are active
                          active1[i] = active;                       // ************
                          })                                       // ************
                .text(key_mo[i]); 
         });
         // Add the X Axis
         svg.append("g")
             .attr("class", "x axis")
             .attr("transform", "translate(0," + height + ")")
             .call(d3.axisBottom(x_mo));
         // Add the Y Axis
         svg.append("g")
             .attr("class", "y axis")
             .call(d3.axisLeft(y_mo));
//---------------------------- below are to plot graph 2 ----------------------
        //x_temp.domain(d3.extent(data1, function(d) { return d.timestamp; }));
        x_temp.domain(d3.extent(data1, function(d) { return d.timestamp; }));
        y_temp.domain([20, d3.max(data1, function(d) { return d.tp4b; })]);
        
        var color_temp = d3.scaleOrdinal(d3.schemeCategory20);
        key_temp.forEach(function(d,i) {
            svg2.append("path")
                .attr("class", "line")
                .style("stroke", color_temp(key_temp[i]))
                .attr("d", valueline_temp[i](data1))
                .attr("id", 'tag'+key_temp[i].replace(/\s+/g, '')); // assign id **
            svg2.append("text")
                .attr("x", (legendSpace/2)+i*legendSpace)  // space legend
                .attr("y", height + (margin.bottom/2)+ 5)
                .attr("class", "legend")    // style the legend
                .style("fill", color_temp(key_temp[i]))
                .on("click", function(){                     // ************
                          // Determine if current line is visible 
                          var active   = act_temp[i] ? false : true,  // ************ 
                          newOpacity = active ? 0 : 1;             // ************
                          // Hide or show the elements based on the ID
                          d3.select("#tag"+key_temp[i].replace(/\s+/g, '')) // *********
                              .transition().duration(100)          // ************
                              .style("opacity", newOpacity);       // ************
                          // Update whether or not the elements are active
                          act_temp[i] = active;                       // ************
                          })                                       // ************
                .text(key_temp[i]); 
         });
         // Add the X Axis
         svg2.append("g")
             .attr("class", "x axis")
             .attr("transform", "translate(0," + height + ")")
             .call(d3.axisBottom(x_temp));
//         // Add the Y Axis
         svg2.append("g")
             .attr("class", "y axis")
             .call(d3.axisLeft(y_temp));
//    svg.append("text")
//        .attr("transform", "translate("+(width+3)+","+y(data1[0].mo2)+")")
//        .attr("dy", ".35em")
//        .attr("text-anchor", "start")
//        .style("fill", "red")
//        .text("Open");
//  
//    svg.append("text")
//        .attr("transform", "translate("+(width+3)+","+y(data1[0].mo1)+")")
//        .attr("dy", ".35em")
//        .attr("text-anchor", "start")
//        .style("fill", "steelblue")
//        .text("Close");
  
})
