

  // -------------------------- below is the function to creat grid lines ---------------
  // gridlines in x axis function
  function make_x_gridlines(x_ax) {		
      return d3.axisBottom(x_ax)
          .ticks(5)
  }
  
  // gridlines in y axis function
  function make_y_gridlines(y_ax) {		
      return d3.axisLeft(y_ax)
          .ticks(5)
  }
  // -------------------------- above is the function to creat grid lines ---------------
  
  
  // below is needed to initializating the picture
  
  // Set the dimensions of the canvas / graph
  // right determins the space for writting things
  var margin = {top: 40, right: 100, bottom: 100, left: 110},  
      width = 1300 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;
  
  
  var format = d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ')
  
  // --------------Adds the svg canvas  -------------------
  //  2017-03-02 12:08  this determines the sequence of plotting appreas.
  var svg_scale = d3.select("body")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");
  
  
  
  // ---------------------below is data defination for load cell -----------------------------
  
  var key_scale=["tas606","te"];
  var act_scale=[];
  var legendSpace_scale = width/ (key_scale.length+1)
  
  var format_scale = d3.timeParse('"%Y-%b-%d %H:%M:%S"')
  
  var float_to_string=String.valueOf()
  
  // Set the ranges
  var x_scale = d3.scaleTime().range([0, width]);
  var y_scale = d3.scaleLinear().range([height, 0]);
  
  //// Define the line for scaleisture
  var valueline_scale=[];
  key_scale.forEach(function(d,i) {
      valueline_scale[i]=d3.line()
          .x(function(d) { return x_scale(d.measure_local_time); })
          .y(function(d) { return y_scale(d[key_scale[i]]); });
  })
  
  
  // ---------------------above is data defination for load cell -----------------------------
  
          var color_scale = d3.scaleOrdinal(d3.schemeCategory10);
  
  
  
  // ------------------------ below is to obtain the load cell data ------------------------
      var data_scale;
      var url_scale =   "https://data.sparkfun.com/output/KJo3Nx8grJcMDpEWQOXg.json"



// ---------------------below is data defination for commercial balance -----------------------------
  
      var key_balance=["commercial"];
      var act_balance=[];
      
      var format_balance = d3.timeParse('"%Y-%b-%d %H:%M:%S"')
      
      var float_to_string=String.valueOf()
      
      // Set the ranges
      //var x_balance = d3.scaleTime().range([0, width]);
      //var y_balance = d3.scaleLinear().range([height, 0]);
      
      //// Define the line for scaleisture
      var valueline_balance=[];
      key_balance.forEach(function(d,i) {
          valueline_balance[i]=d3.line()
              .x(function(d) { return x_scale(d.measure_local_time); })
              .y(function(d) { return y_scale(d[key_balance[i]]); });
      })
      
  
// ---------------------above is data defination for commercial balance -----------------------------


// making sure get_balance is executed after get_scale is done
// reference: http://stackoverflow.com/questions/5000415/call-a-function-after-previous-function-is-complete
get_scale(   function() {
    get_balance();
     });
//$.when(get_scale()).then(get_balance());

function get_scale(callback){
      d3.json(url_scale,  function (error,json) {
          if (error) return console.warn(error);
          json.forEach(function(d) {
              d.measure_local_time = format_scale(d.measure_local_time);
              d.tas606=d.tas606/16.73;
              d.te=(d.te-89)/0.00597;
          });
  	 
      	  data_scale=json;
      	  console.log(data_scale)
          x_scale.domain(d3.extent(data_scale, function(d) { return d.measure_local_time; }));
          y_scale.domain([9000,20000]);

  // ------------------------ above is to obtain the load cell data ------------------------




  // --------------------------below is for the plotting of the load cell sensor -----------------------
  
  
          key_scale.forEach(function(d,i) {
              svg_scale.append("path")
                  .attr("class", "line")
                  .style("stroke", color_scale(key_scale[i]))
                  .attr("d", valueline_scale[i](data_scale))
                  .attr("id", 'tag'+key_scale[i].replace(/\s+/g, '')); // assign id **
  
              svg_scale.append("text")
                  .attr("x", (legendSpace_scale/3)+i*legendSpace_scale)  // space legend
                  .attr("y", -20 )
                  //.attr("y", height + (margin.bottom/2)+ 5)
                  .attr("class", "legend")    // style the legend
                  .style("fill", color_scale(key_scale[i]))
                  .on("click", function(){                  
                            // Determine if current line is visible 
                            var active   = act_scale[i] ? false : true,  
                            newOpacity = active ? 0 : 1;        
                            // Hide or show the elements based on the ID
                            d3.select("#tag"+key_scale[i].replace(/\s+/g, '')) 
                                .transition().duration(100)  
                                .style("opacity", newOpacity);
                            // Update whether or not the elements are active
                            act_scale[i] = active;        
                            })                             
                  .text(key_scale[i]); 
           }); // key_scale.foreach
  
           // Add the X Axis
           svg_scale.append("g")
               .attr("class", "x axis")
               .attr("transform", "translate(0," + height + ")")
               .call(d3.axisBottom(x_scale));
           svg_scale.append("text")             
               .attr("transform",
                     "translate(" + (width/2) + " ," + 
                                    (height + margin.top + 10) + ")")
               .style("text-anchor", "middle")
               .style("font-size", "18px")
               .text("TIME");
  
           // Add the Y Axis
           svg_scale.append("g")
               .attr("class", "y axis")
               .call(d3.axisLeft(y_scale));

           // Add the Y Axis on the right hand side
           svg_scale.append("g")
               .attr("class", "y axis")
               .attr("transform", "translate(" + width + " ,0)")
               .call(d3.axisRight(y_scale));   // this right here means the label is on the right hand side of the axis

           // text label for the y axis
            svg_scale.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("font-size", "18px")
                .text("LOAD CELL READING (G)");    
  
           // draw grid lines
           svg_scale.append("g")         
               .attr("class", "grid")
               .attr("transform", "translate(0," + height + ")")
               .call(make_x_gridlines(x_scale)
                   .tickSize(-height, 0, 0)
                   .tickFormat("")
               )
  
           svg_scale.append("g")         
               .attr("class", "grid")
               .call(make_y_gridlines(y_scale)
                   .tickSize(-width, 0, 0)
                   .tickFormat("")
               )
// ---------------------------------  above is plotting of scale results --------------------
  })   // json for load cell
  callback();
} //function get_scale 





function get_balance(){
      // below balance data
      var data_balance;
      var url_balance =   "https://data.sparkfun.com/output/7Jlzv3bb9vhZ4LLd9Waj.json"
      d3.json(url_balance,  function (error2,json2) 
        {
          if (error2) return console.warn(error2);
          json2.forEach(function(d) 
          {
              d.measure_local_time = format_balance(d.measure_local_time);
              d.commercial=d.commercial/1.0;
          });
  	 
      	data_balance=json2;
      	console.log(data_balance)
	//x_balance_bound=d3.extent(data_balance, function(d) { return d.measure_local_time; });
	//x_balance_bound[0] = d3.timeDay.offset(x_balance_bound[0],-15)
	//x_balance.domain(x_balance_bound)
        ////x_balance.domain(d3.extent(data_balance, function(d) { return d.measure_local_time; }));
        ////2017-03-02 11:39 some thoughts here:
	//// the reason data_scale is not working is because
        //y_balance.domain([9000,20000]);

  // ------------------------ above is to obtain the balance data ------------------------

          key_balance.forEach(function(d,i) {
              svg_scale.append("path")
                  .attr("class", "line")
                  .attr("d", valueline_balance[i](data_balance))
                  .style("stroke", color_scale(key_balance[i+2]))
                  .attr("id", 'tag'+key_balance[i].replace(/\s+/g, '')); 
  
              svg_scale.append("text")
                  .attr("x", (legendSpace_scale/3)+(i+2)*legendSpace_scale)  // space legend
                  .attr("y", -20 )
                  //.attr("y", height + (margin.bottom/2)+ 5)
                  .attr("class", "legend")    // style the legend
                  .style("fill", color_scale(key_balance[i+2]))
                  .on("click", function(){                  
                            // Determine if current line is visible 
                            var active   = act_balance[i] ? false : true,  
                            newOpacity = active ? 0 : 1;        
                            // Hide or show the elements based on the ID
                            d3.select("#tag"+key_balance[i].replace(/\s+/g, '')) 
                                .transition().duration(100)  
                                .style("opacity", newOpacity);
                            // Update whether or not the elements are active
                            act_balance[i] = active;        
                            })                             
                  .text(key_balance[i]); 

           }); // key_balance.foreach

         })   // json for balance

}
  
// http://stackoverflow.com/questions/1215392/how-to-quickly-and-conveniently-disable-all-console-log-statements-in-my-code 
console.log = function() {}  
  
  
  

 
  
  
