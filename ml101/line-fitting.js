d3.csv("sales_per_sft_small.csv", function(data, error) {
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
 
	var chart = d3.select('body')
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

	// draw the y axis
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient('left');

	main.append('g')
		.attr('transform', 'translate(0,0)')
		.attr('class', 'main axis date')
		.call(yAxis);

	var g = main.append("svg:g"); 
	g.selectAll("scatter-dots")
		  .data(data)
		  .enter().append("svg:circle")
			  .attr("cx", function (d,i) { return x(d.SFt); } )
			  .attr("cy", function (d) { return y(d.DailySale); } )
			  .attr("r", 4);

	var lineGenerator = d3.svg.line()
				.x(function(d) {return x(d[0]);})
				.y(function(d) {return y(d[1]);});
// 	var pathString = lineGenerator([[x(xMin), y(yMin)], [x(xMax), y(yMax)]]);
	g.append("path")
		.datum([[xMin, yMin], [xMax, yMax]])
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("stroke-width", 1.5)
// 		.attr("d", pathString);
		.attr("d", lineGenerator);
	
});
