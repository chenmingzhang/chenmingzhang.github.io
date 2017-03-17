  
  // -----------------------below is to draw gec logo -------------------
  var width_gec = 1250,
      height_gec = 100;
  
  var svg_gec = d3.select("body").append("svg")
      .attr("width", width_gec)
      .attr("height", height_gec);
  
  var g_gec = svg_gec.append("g");
  
  var img = g_gec.append("svg:image")
      .attr("xlink:href", "https://outbox.eait.uq.edu.au/uqczhan2/photo_geo_1st/gec.PNG")
      .attr("width", 1250)
      .attr("height", 100)
      .attr("x", 0)
      .attr("y",0);
  // -----------------------above is to draw gec logo------------------
  
  
  
