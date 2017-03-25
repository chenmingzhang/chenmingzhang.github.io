// below is needed to initializating the picture
// Set the dimensions of the canvas / graph
// right determins the space for writting things
var margin = {top: 30, right: 100, bottom: 100, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
// Parse the date / time
//var parseDate = d3.timeParse("%d-%b-%y");
//http://stackoverflow.com/questions/1208222/how-to-do-associative-array-hashing-in-javascript


var format = d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ')

scale= {};
scale.key=["scale"];
scale.ylim=[15000,17000];


moisture= {};
moisture.key=["mo1","mo2","mo3","mo4","mo5","mo6","mo7","mo8","mo9","mo10","mo11"];
moisture.ylim=[200,600];


temperature= {};
temperature.key=["tp12","tp2","tp21","tp32","tp35","tp4b","tp8a","tp9f","tpa3","tpc7","tpe5","ht115t","ht119t"];
temperature.ylim=[20,40];


relativehumidity= {};
relativehumidity.key=["ht115rh","ht119rh"];
relativehumidity.ylim=[0,100];


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
        });
	 
    	data1=json;
    	console.log(data1)
        // plot scale result
        plot_func2(scale,data1);
        // plot scale result
        plot_func2(relativehumidity,data1);
        // plot moisture result
        plot_func2(moisture,data1);
        // plot temperature result
        plot_func2(temperature,data1);
  
})   // d3.json



function plot_func2(prop,data1) {
    prop.legendSpace=width/prop.key.length;
    prop.active1=[];
    prop.valueline=[];
    prop.x= d3.scaleTime().range([0, width]);
    prop.y= d3.scaleLinear().range([height, 0]);
    prop.key.forEach(function(d,i) {
        prop.valueline[i]=d3.line()
            .x(function(d) { return prop.x(d.timestamp); })
            .y(function(d) { return prop.y(d[prop.key[i]]); });
    })

    prop.svg = d3.select("body")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", 
                  "translate(" + margin.left + "," + margin.top + ")");
//----------------below are moisture plottings---------------------- 
// input x_mo, y_mo, key_mo, valueline_mo, data1,
        prop.x.domain(d3.extent(data1, function(d) { return d.timestamp; }));
        //http://stackoverflow.com/questions/7538519/how-to-get-subarray-from-array 
        //x_mo.domain(d3.extent(data1.slice(1,1500), function(d) { return d.timestamp; }));
        //prop.y.domain([200, d3.max(data1, function(d) { return d.mo10; })]);
        prop.y.domain(prop.ylim);
        //var color = d3.scaleOrdinal(d3.schemeCategory10);
        var color = d3.scaleOrdinal(d3.schemeCategory20);
        prop.key.forEach(function(d,i) {
            prop.svg.append("path")
                .attr("class", "line")
                .style("stroke", color(prop.key[i]))
                .attr("d", prop.valueline[i](data1))
                .attr("id", 'tag'+prop.key[i].replace(/\s+/g, '')); // assign id **
            prop.svg.append("text")
                .attr("x", (prop.legendSpace/2)+i*prop.legendSpace)  // space legend
                .attr("y", height + (margin.bottom/2)+ 5)
                .attr("class", "legend")    // style the legend
                .style("fill", color(prop.key[i]))
                .on("click", function(){      
                          // Determine if current line is visible 
                          var active   = prop.active1[i] ? false : true, 
                          newOpacity = active ? 0 : 1;             // ************
                          // Hide or show the elements based on the ID
                          d3.select("#tag"+prop.key[i].replace(/\s+/g, ''))
                              .transition().duration(100) 
                              .style("opacity", newOpacity);
                          // Update whether or not the elements are active
                          prop.active1[i] = active; 
                          })  
                .text(prop.key[i]); 
         });
         // Add the X Axis
         prop.svg.append("g")
             .attr("class", "x axis")
             .attr("transform", "translate(0," + height + ")")
             .call(d3.axisBottom(prop.x));
         // Add the Y Axis
         prop.svg.append("g")
             .attr("class", "y axis")
             .call(d3.axisLeft(prop.y));

}
