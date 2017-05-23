d3.csv("sales_per_sft_full.csv", function(data, error) {
	data.forEach(function(d) {
		d.SFt = +d.SFt;
		d.DailySale = +d.DailySale;
	});
	var margin = {top: 20, right: 15, bottom: 60, left: 60}
		  , width = 960 - margin.left - margin.right
		  , height = 500 - margin.top - margin.bottom;

	var xMin = d3.min(data, function(d) { return d.SFt; })
		, xMax = d3.max(data, function(d) { return d.SFt; })
		, yMin = d3.min(data, function(d) { return d.DailySale; })
		, yMax = d3.max(data, function(d) { return d.DailySale; });

	var x = d3.scale.linear()
			.domain([xMin - 1, xMax + 1])
			.range([ 0, width ]);
	
	var y = d3.scale.linear()
			.domain([yMin - 1, yMax + 1])
			.range([ height, 0 ]);
 
	var chart = d3.select('.content')
		.append('svg:svg')
		.attr('width', width + margin.right + margin.left)
		.attr('height', height + margin.top + margin.bottom)
		.attr('class', 'chart')

	var main = chart.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('width', width)
		.attr('height', height)
		.attr('class', 'main')   
		
	// draw the x axis
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient('bottom');

	main.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.attr('class', 'main axis date')
		.call(xAxis);

	// text label for the x axis
	main.append("text")
		.attr("transform", "translate(" + (width) + " ," + (height - margin.top + 10) + ")")
		.style("text-anchor", "end")
		.text("Area in Square Foot ('000)");

	// draw the y axis
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient('left');

	main.append('g')
		.attr('transform', 'translate(0,0)')
		.attr('class', 'main axis date')
		.call(yAxis);

	main.append("text")
		.attr("class", "y label")
		.attr("text-anchor", "end")
		.attr("y", 6)
		.attr("dy", ".75em")
		.attr("transform", "rotate(-90)")
		.text("Daily Sales ('000 $)");

	var g = main.append("svg:g"); 
	g.selectAll("scatter-dots")
		  .data(data)
		  .enter().append("svg:circle")
			  .attr("cx", function (d,i) { return x(d.SFt); } )
			  .attr("cy", function (d) { return y(d.DailySale); } )
			  .attr("r", 4);

	var m = 1, c = 40.08
	var lineGenerator = d3.svg.line()
				.x(function(d) {return x(d[0]);})
				.y(function(d) {return y(d[1]);});
// 				.y(function(d) {return y(m * d[0] + c);});
// 	var pathString = lineGenerator([[x(xMin), y(yMin)], [x(xMax), y(yMax)]]);
	var line = g.append("path")
		.datum([[xMin-0.25, yMin-0.25], [xMax+0.25, yMax+0.25]])
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("stroke-width", 1.5)
// 		.attr("d", pathString);
		.attr("class", "line")
		.attr("d", lineGenerator);
	
	$( function() {
		$("#slope").slider({
			orientation: "vertical",
			range: "min",
			min: 1,
			max: 1.5,
			step: 0.01,
			value: 1,
			slide: function( event, ui ) {
				m = ui.value;
				var x1 = xMin - 0.25,
				    y1 = x1 + c,
				    x2 = xMax + 0.25,
				    y2 = m * x2 + c;
				var chart = d3.select("body").transition();
				chart.select(".line")
					.duration(750)
					.attr("d", lineGenerator([[x1, y1], [x2, y2]]));
// 					.datum([[x1, y1], [x2, y2]]);
			}
		});
		$("#constant").slider({
			orientation: "vertical",
			range: "min",
			min: 38.08,
			max: 42.08,
			step: 0.01,
			value: 40,
			slide: function( event, ui ) {
				c = ui.value;
				var x1 = xMin - 0.25,
				    y1 = x1 + c,
				    x2 = xMax + 0.25,
				    y2 = m * x2 + c;
				var chart = d3.select("body").transition();
				chart.select(".line")
					.duration(750)
					.attr("d", lineGenerator([[x1, y1], [x2, y2]]));
			}
		});
	} );

});
