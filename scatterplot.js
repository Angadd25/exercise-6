// js/scatterplot.js

function drawScatterplot(data) {
    const container = d3.select("#scatterplot");
    container.select("svg").remove();

    const svgWidth = container.node().getBoundingClientRect().width;
    const svgHeight = heightS + marginS.top + marginS.bottom;
    const innerWidthS = svgWidth - marginS.left - marginS.right;
    xScaleS.range([0, innerWidthS]);
    yScaleS.range([heightS, 0]);

    const svg = container.append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", `translate(${marginS.left},${marginS.top})`);

    innerChartS = svg.append("g");

    // Set up x and y scales
    const maxStarRating = d3.max(data, d => +d.star);
    const maxEnergyConsumption = d3.max(data, d => +d.energyConsumption);

    xScaleS.domain([0, maxStarRating]);
    yScaleS.domain([0, maxEnergyConsumption]);

    console.log("xScaleS domain:", xScaleS.domain());
    console.log("yScaleS domain:", yScaleS.domain());

    // Draw the circles
    const circles = innerChartS.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("r", 5)
        .attr("fill", d => {
            const color = colorScale(d.screenTech);
            console.log("Screen Tech:", d.screenTech, "Color:", color); // Added console log
            return color;
        })
        .attr("opacity", 0.7)
        .attr("cx", d => xScaleS(+d.star))
        .attr("cy", d => yScaleS(+d.energyConsumption))
        .on("mouseenter", handleMouseEvents)
        .on("mouseleave", handleMouseLeave);

    console.log("Number of circles drawn:", circles.size());

    // Add bottom axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${heightS})`)
        .call(d3.axisBottom(xScaleS).ticks(5))
        .append("text")
        .attr("class", "x-axis-label")
        .attr("x", innerWidthS / 2)
        .attr("y", marginS.bottom - 5)
        .attr("text-anchor", "middle")
        .text("Star Rating");

    // Add left axis
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScaleS))
        .append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - marginS.left + 10)
        .attr("x", 0 - (heightS / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Energy Consumption");

    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(${innerWidthS - 80}, 20)`);

    const legendData = colorScale.domain();
    legendData.forEach((tech, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);

        legendRow.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", colorScale(tech));

        legendRow.append("text")
            .attr("x", 15)
            .attr("y", 10)
            .style("font-size", "0.8em")
            .attr("text-anchor", "start")
            .text(tech);
    });
}