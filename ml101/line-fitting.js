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
 
	// Define the div for the tooltip
	var tooltip = d3.select("body").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);

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

	// text label for the y axis
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
			.attr("r", 4)
			.on("mouseover", function(d) {
				tooltip.transition()
					.duration(200)
					.style("opacity", .9);
				tooltip.html("Area: " + d.SFt + " '000 Square Foot.<br/>Daily Sales: " + d.DailySale + " '000 $")	
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 28) + "px");
			})
			.on("mouseout", function(d) {
				tooltip.transition()
					.duration(500)
					.style("opacity", 0);
			});

	var m = 1.04, c = 38.08
	var lineGenerator = d3.svg.line()
				.x(function(d) {return x(d[0]);})
				.y(function(d) {return y(d[1]);});
// 				.y(function(d) {return y(m * d[0] + c);});

	var line = g.append("path")
// 		.datum([[xMin-0.25, yMin-0.25], [xMax+0.25, yMax+0.25]])
		.datum([[xMin-0.25, xMin - 0.25 + c], [xMax+0.25, m * (xMax+0.25) + c]])
		.attr("fill", "none")
		.attr("stroke", "red")
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("stroke-width", 1.5)
		.attr("class", "line")
		.attr("d", lineGenerator);
	
	// text labels for the m, c & equation
	var mLabel = main.append("text")
		.attr("transform", "translate(" + (width) + " ," + (height - margin.top - 90) + ")")
		.attr("fill", "green")
		.style("text-anchor", "end")
		.style("font-size", "24")
		.text("m = "+m)
	var cLabel = main.append("text")
		.attr("transform", "translate(" + (width) + " ," + (height - margin.top - 60) + ")")
		.attr("fill", "green")
		.style("text-anchor", "end")
		.style("font-size", "24")
		.text("c = "+c)
	var equation = main.append("text")
		.attr("transform", "translate(" + (width) + " ," + (height - margin.top - 30) + ")")
		.attr("fill", "red")
		.style("text-anchor", "end")
		.style("font-size", "30")
		.text("y = "+m+"x + "+c)

	$( function() {
		$("#slope").slider({
			orientation: "horizontal",
			range: "min",
			min: 1.04,
			max: 1.5,
			step: 0.01,
			value: 1.04,
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
				mLabel.text("m = "+m);
				equation.text("y = "+m+"x + "+c);
// 					.datum([[x1, y1], [x2, y2]]);
			}
		});
		$("#constant").slider({
			orientation: "horizontal",
			range: "min",
			min: 38.08,
			max: 42.08,
			step: 0.01,
			value: 38.08,
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
				cLabel.text("c = "+c);
				equation.text("y = "+m+"x + "+c);
			}
		});
	} );

});
