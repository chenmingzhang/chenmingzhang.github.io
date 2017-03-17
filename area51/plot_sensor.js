  
  var key_mo=["mo_7","mo_8","mo_9","mo_10"];
  var key_temp=["suht_28e5_begin","suht_28e5_peak","suht_28e5_end","suht_2847_begin","suht_2847_peak","suht_2847_end","saltrh_2_tp","saltrh_3_tp"];
  
  
  var act_mo=[];
  var act_temp=[];
  
  
  var legendSpace_mo = width/ key_mo.length
  var legendSpace_temp = width/ key_temp.length
  
  var format = d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ')
  
  //tenHourslater = d3.time.hour.offset(d, 10)
  
  // Set the ranges
  var x_mo = d3.scaleTime().range([0, width]);
  var y_mo = d3.scaleLinear().range([height, 0]);
  var x_temp = d3.scaleTime().range([0, width]);
  var y_temp = d3.scaleLinear().range([height, 0]);
  
  
  
  
  // ---------Define the line for moisture
  var valueline_mo=[];
  key_mo.forEach(function(d,i) {
      valueline_mo[i]=d3.line()
          .x(function(d) { return x_mo(d.timestamp); })
          .y(function(d) { return y_mo(d[key_mo[i]]); });
  })
  
  //// Define the line for moisture
  var valueline_temp=[];
  key_temp.forEach(function(d,i) {
      valueline_temp[i]=d3.line()
          .x(function(d) { return x_temp(d.timestamp); })
          .y(function(d) { return y_temp(d[key_temp[i]]); });
  })
  
  
  // --------------Adds the svg canvas  -------------------
  var svg_mo = d3.select("body")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");
  
  var svg_temp = d3.select("body")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");
  
  // ---------------------below is data defination for the delta temp --------------------------
  
  var key_del_temp=["del_temp_28e5_heating","del_temp_28e5_cooling","del_temp_2847_heating","del_temp_2847_cooling"]; 
  var act_del_temp=[];
  var legendSpace_del_temp = width/ key_del_temp.length;
  
  var x_del_temp = d3.scaleTime().range([0, width]);
  var y_del_temp = d3.scaleLinear().range([height, 0]);
  
  //// Define the line for moisture
  var valueline_del_temp=[];
  key_del_temp.forEach(function(d,i) {
      valueline_del_temp[i]=d3.line()
          .x(function(d) { return x_del_temp(d.timestamp); })
          .y(function(d) { return y_del_temp(d[key_del_temp[i]]); });
  })
  
  
  var svg_del_temp = d3.select("body")
      .append("svg")
          .attr("width", width + margin.left + margin.right) .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");
  
  // ---------------------above is data defination for the delta temperature  --------------------------
  
  // ---------------------below is data defination for the relative humidity sensor --------------------------
  
  var key_rh=["saltrh_2_rh","saltrh_3_rh"];
  
  var act_rh=[];
  var legendSpace_rh = width/ key_rh.length;
  
  var x_rh = d3.scaleTime().range([0, width]);
  var y_rh = d3.scaleLinear().range([height, 0]);
  
  //// Define the line for moisture
  var valueline_rh=[];
  key_rh.forEach(function(d,i) {
      valueline_rh[i]=d3.line()
          .x(function(d) { return x_rh(d.timestamp); })
          .y(function(d) { return y_rh(d[key_rh[i]]); });
  })
  
  
  var svg_rh = d3.select("body")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");
  
  // ---------------------above is data defination for the relative humidity sensor --------------------------
  
  
  
  
  
  
  
  
  
  // ----------------------below is to obtain the data from the sensors------------------------------
  
      var data1;
      var url =   "https://data.sparkfun.com/output/9J2rX3QZ94s5RJ9LjrbN.json"
      d3.json(url,  function (error,json) {
          //if (error) return console.warn(error);
          if (error) throw error;
          json.forEach(function(d) {
              //d.timestamp = format(d.timestamp);
              d.timestamp = d3.timeHour.offset(format(d.timestamp),+10);  // http://stackoverflow.com/questions/18796291/d3-get-current-time-and-subtract-by-2-hours
	      d.del_temp_28e5_heating=d.suht_28e5_peak-d.suht_28e5_begin;
	      d.del_temp_28e5_cooling=d.suht_28e5_peak-d.suht_28e5_end;
	      d.del_temp_2847_heating=d.suht_2847_peak-d.suht_2847_begin;
	      d.del_temp_2847_cooling=d.suht_2847_peak-d.suht_2847_end;
              //dataset.date = parseDate(d.date);
              //dataset.close = +d.close;
  	    //if (d.saltrh_3_tp == "NaN") {d.saltrh_3_tp=NaN}
  	    //if (d.saltrh_3_rh == "NaN") {d.saltrh_3_rh=NaN}
          });
  	 
      	data1=json;
      	console.log(data1)
   //       console.log(active1)
  //  http://stackoverflow.com/questions/10024866/remove-object-from-array-using-javascript
  //   remove all lines that has NaN
      data1=data1.filter(function(el){
      return el.saltrh_3_rh != "NaN";
      });
  
      console.log(JSON.stringify(data1, null, ' '));
  
  // ----------------------above is to obtain the data ------------------------------
  
  
  
  
  
  //-------------------below are for moisture sensor plot------------------- 
          x_mo.domain(d3.extent(data1, function(d) { return d.timestamp; }));
         //y_mo.domain([200, d3.max(data1, function(d) { return d.mo_10; })]);
          y_mo.domain([230, 590]);
  
          //var color = d3.scaleOrdinal(d3.schemeCategory10);
          var color = d3.scaleOrdinal(d3.schemeCategory20);
  
          key_mo.forEach(function(d,i) {
              svg_mo.append("path")
                  .attr("class", "line")
  //                .attr("stroke-width", 20)  
                  .style("stroke", color(key_mo[i]))
                  .attr("d", valueline_mo[i](data1))
                  .attr("id", 'tag'+key_mo[i].replace(/\s+/g, '')); // assign id **
  
              svg_mo.append("text")
                  .attr("x", (legendSpace_mo/2)+i*legendSpace_mo)  // space legend
                  .attr("y", -20 )
                  //.attr("y", height + (margin.bottom/2)+ 5)
                  .attr("class", "legend")    // style the legend
                  .style("fill", color(key_mo[i]))
                  .on("click", function(){                     
                            // Determine if current line is visible 
                            var active   = act_mo[i] ? false : true,  
                            newOpacity = active ? 0 : 1;             
                            // Hide or show the elements based on the ID
                            d3.select("#tag"+key_mo[i].replace(/\s+/g, ''))
                                .transition().duration(100)         
                                .style("opacity", newOpacity);     
                            // Update whether or not the elements are active
                            act_mo[i] = active;    
                            })                    
                  .text(key_mo[i]); 
           });
  
           // Add the X Axis
           svg_mo.append("g")
               .attr("class", "x axis")
               .attr("transform", "translate(0," + height + ")")
               .call(d3.axisBottom(x_mo));
           // text label for the x axis
           svg_mo.append("text")             
               .attr("transform",
                     "translate(" + (width/2) + " ," + 
                                    (height + margin.top + 10) + ")")
               .style("text-anchor", "middle")
               .style("font-size", "18px")
               .text("TIME");
  
           // Add the Y Axis
           svg_mo.append("g")
               .attr("class", "y axis")
               .call(d3.axisLeft(y_mo));
           

           // Add the Y Axis on the right hand side
           svg_mo.append("g")
               .attr("class", "y axis")
               .attr("transform", "translate(" + width + " ,0)")
               .call(d3.axisRight(y_mo));   // this right here means the label is on the right hand side of the axis
  
           // text label for the y axis
            svg_mo.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("font-size", "18px")
                .text("MOISTURE SENSOR READING");    

           // draw grid lines
           svg_mo.append("g")         
               .attr("class", "grid")
               .attr("transform", "translate(0," + height + ")")
               .call(make_x_gridlines(x_mo)
                   .tickSize(-height, 0, 0)
                   .tickFormat("")
               )
           svg_mo.append("g")         
               .attr("class", "grid")
               .call(make_y_gridlines(y_mo)
                   .tickSize(-width, 0, 0)
                   .tickFormat("")
               )
  //---------------------------- below are to plot temperature sensors ----------------------
          //x_temp.domain(d3.extent(data1, function(d) { return d.timestamp; }));
          x_temp.domain(d3.extent(data1, function(d) { return d.timestamp; }));
         // y_temp.domain([0, d3.max(data1, function(d) { return d.tp1; })]);
          //y_temp.domain([20, d3.max(data1, function(d) { return d.suht_2847_begin; })]);
          y_temp.domain([22, 65]);
          
          var color_temp = d3.scaleOrdinal(d3.schemeCategory10);
          key_temp.forEach(function(d,i) {
              svg_temp.append("path")
                  .attr("class", "line")
                  .style("stroke", color_temp(key_temp[i]))
                  .attr("d", valueline_temp[i](data1))
                  .attr("id", 'tag'+key_temp[i].replace(/\s+/g, '')); // assign id **
  
              svg_temp.append("text")
                  .attr("x", (legendSpace_temp/2)+i*legendSpace_temp)  // space legend
                  .attr("y", -20 )
                  //.attr("y", height + (margin.bottom/2)+ 5)
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
           svg_temp.append("g")
               .attr("class", "x axis")
               .attr("transform", "translate(0," + height + ")")
               .call(d3.axisBottom(x_temp));
  
  //         // Add the Y Axis
           svg_temp.append("g")
               .attr("class", "y axis")
               .call(d3.axisLeft(y_temp));
           
  
           // Add the Y Axis on the right hand side
           svg_temp.append("g")
               .attr("class", "y axis")
               .attr("transform", "translate(" + width + " ,0)")
               .call(d3.axisRight(y_temp));   // this right here means the label is on the right hand side of the axis

             // text label for the y axis
            svg_temp.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("font-size", "18px")
                .text("TEMPERATURE (CELSIUS)");    
  
           // text label for the x axis
           svg_temp.append("text")             
               .attr("transform",
                     "translate(" + (width/2) + " ," + 
                                    (height + margin.top + 10) + ")")
               .style("text-anchor", "middle")
               .style("font-size", "20px")
               .text("TIME");
  
           // draw grid lines
           svg_temp.append("g")         
               .attr("class", "grid")
               .attr("transform", "translate(0," + height + ")")
               .call(make_x_gridlines(x_temp)
                   .tickSize(-height, 0, 0)
                   .tickFormat("")
               )
           svg_temp.append("g")         
               .attr("class", "grid")
               .call(make_y_gridlines(y_temp)
                   .tickSize(-width, 0, 0)
                   .tickFormat("")
               )
  //---------------------------- below are for delta temperature ----------------------
          x_del_temp.domain(d3.extent(data1, function(d) { return d.timestamp; }));
          y_del_temp.domain([0, 30]);
          
          var color_del_temp = d3.scaleOrdinal(d3.schemeCategory10);
          key_del_temp.forEach(function(d,i) {
              svg_del_temp.append("path")
                  .attr("class", "line")
                  .style("stroke", color_del_temp(key_del_temp[i]))
                  .attr("d", valueline_del_temp[i](data1))
                  .attr("id", 'tag'+key_del_temp[i].replace(/\s+/g, '')); // assign id **
  
              svg_del_temp.append("text")
                  .attr("x", (legendSpace_del_temp/2)+i*legendSpace_del_temp)  // space legend
                  .attr("y", -20 )
//                  .attr("y", height + (margin.bottom/2)+ 45)
                  .attr("class", "legend")    // style the legend
                  .style("fill", color_del_temp(key_del_temp[i]))
                  .on("click", function(){                     // ************
                            // Determine if current line is visible 
                            var active   = act_del_temp[i] ? false : true,  // ************ 
                            newOpacity = active ? 0 : 1;             // ************
                            // Hide or show the elements based on the ID
                            d3.select("#tag"+key_del_temp[i].replace(/\s+/g, '')) // *********
                                .transition().duration(100)          // ************
                                .style("opacity", newOpacity);       // ************
                            // Update whether or not the elements are active
                            act_del_temp[i] = active;                       // ************
                            })                                       // ************
                  .text(key_del_temp[i]); 
           });
  
           // Add the X Axis
           svg_del_temp.append("g")
               .attr("class", "x axis")
               .attr("transform", "translate(0," + height + ")")
               .call(d3.axisBottom(x_del_temp));
  
  
           // text label for the x axis
           svg_del_temp.append("text")             
               .attr("transform",
                     "translate(" + (width/2) + " ," + 
                                    (height + margin.top + 40) + ")") // location of x axis
               .style("text-anchor", "middle")
               .style("font-size", "20px")
               .text("TIME");
  
           // Add the Y Axis
           svg_del_temp.append("g")
               .attr("class", "y axis")
               .call(d3.axisLeft(y_del_temp));
 
           // Add the Y Axis on the right hand side
           svg_del_temp.append("g")
               .attr("class", "y axis")
               .attr("transform", "translate(" + width + " ,0)")
               .call(d3.axisRight(y_del_temp));   // this right here means the label is on the right hand side of the axis

 
           // text label for the y axis
            svg_del_temp.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("font-size", "18px")
                .text("TEMPERATURE DIFFERENCE (CELSIUS)");    

           // draw grid lines
           svg_del_temp.append("g")         
               .attr("class", "grid")
               .attr("transform", "translate(0," + height + ")")
               .call(make_x_gridlines(x_del_temp)
                   .tickSize(-height, 0, 0)
                   .tickFormat("")
               )
           svg_del_temp.append("g")         
               .attr("class", "grid")
               .call(make_y_gridlines(y_del_temp)
                   .tickSize(-width, 0, 0)
                   .tickFormat("")
               )
  
  // --------------------------above is for delta temperature -----------------------

  //---------------------------- below are for humidity sensor ----------------------
          x_rh.domain(d3.extent(data1, function(d) { return d.timestamp; }));
          y_rh.domain([45, 105]);
          
          var color_rh = d3.scaleOrdinal(d3.schemeCategory10);
          key_rh.forEach(function(d,i) {
              svg_rh.append("path")
                  .attr("class", "line")
                  .style("stroke", color_rh(key_rh[i]))
                  .attr("d", valueline_rh[i](data1))
                  .attr("id", 'tag'+key_rh[i].replace(/\s+/g, '')); // assign id **
  
              svg_rh.append("text")
                  .attr("x", (legendSpace_rh/2)+i*legendSpace_rh)  // space legend
                  .attr("y", -20 )
//                  .attr("y", height + (margin.bottom/2)+ 45)
                  .attr("class", "legend")    // style the legend
                  .style("fill", color_rh(key_rh[i]))
                  .on("click", function(){                     // ************
                            // Determine if current line is visible 
                            var active   = act_rh[i] ? false : true,  // ************ 
                            newOpacity = active ? 0 : 1;             // ************
                            // Hide or show the elements based on the ID
                            d3.select("#tag"+key_rh[i].replace(/\s+/g, '')) // *********
                                .transition().duration(100)          // ************
                                .style("opacity", newOpacity);       // ************
                            // Update whether or not the elements are active
                            act_rh[i] = active;                       // ************
                            })                                       // ************
                  .text(key_rh[i]); 
           });
  
           // Add the X Axis
           svg_rh.append("g")
               .attr("class", "x axis")
               .attr("transform", "translate(0," + height + ")")
               .call(d3.axisBottom(x_rh));
  
  
           // text label for the x axis
           svg_rh.append("text")             
               .attr("transform",
                     "translate(" + (width/2) + " ," + 
                                    (height + margin.top + 40) + ")") // location of x axis
               .style("text-anchor", "middle")
               .style("font-size", "20px")
               .text("TIME");
  
           // Add the Y Axis
           svg_rh.append("g")
               .attr("class", "y axis")
               .call(d3.axisLeft(y_rh));
  

           // Add the Y Axis on the right hand side
           svg_rh.append("g")
               .attr("class", "y axis")
               .attr("transform", "translate(" + width + " ,0)")
               .call(d3.axisRight(y_rh));   // this right here means the label is on the right hand side of the axis

           // text label for the y axis
            svg_rh.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("font-size", "18px")
                .text("RELATIVE HUMIDITY (PERCENT)");    

           // draw grid lines
           svg_rh.append("g")         
               .attr("class", "grid")
               .attr("transform", "translate(0," + height + ")")
               .call(make_x_gridlines(x_rh)
                   .tickSize(-height, 0, 0)
                   .tickFormat("")
               )
           svg_rh.append("g")         
               .attr("class", "grid")
               .call(make_y_gridlines(y_rh)
                   .tickSize(-width, 0, 0)
                   .tickFormat("")
               )
  
  // --------------------------above is for relative humidity sensor -----------------------
  })  // json
  

 
  
  
  
