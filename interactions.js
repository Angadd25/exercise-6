// js/interactions.js
function populateFilters(data) {
    const filtersDiv = d3.select("#filters_screen");

    filters_screen.forEach(filter => {
        const button = filtersDiv.append("button")
            .attr("class", "filter-button")
            .attr("id", `filter-${filter.id}`)
            .text(filter.label)
            .classed("active", filter.isActive)
            .on("click", function() {
                console.log('OLED button clicked'); // Added log
                filters_screen.forEach(f => f.isActive = (f.id === filter.id));
                d3.selectAll(".filter-button").classed("active", function() {
                    return d3.select(this).datum().isActive;
                });
                const filteredData = filterData(data, filter.id); // Apply filter
                updateHistogram(filteredData, filter.id);
                drawScatterplot(filteredData); // Redraw scatterplot with filtered data
            })
            .datum(filter);
    });
}

function filterData(data, filterId) {
    console.log("filterData called with filterId:", filterId);
    const filtered = data.filter(d => {
        const match = (filterId === "all" || d.screenTech === filterId);
        console.log("Checking:", d.screenTech, "against:", filterId, "Result:", match);
        if (d.screenTech === filterId && filterId === "OLED") {
            console.log("OLED Energy Consumption:", d.energyConsumption, typeof d.energyConsumption);
        }
        return match;
    });
    console.log("Filtering for:", filterId, "Result count:", filtered.length);
    return filtered;
}

function updateHistogram(data, filterId) {
    console.log("updateHistogram called with data:", data, "and filterId:", filterId);
    if (!data || data.length === 0) {
        console.log("updateHistogram received null or an empty array. Skipping bin generation.");
        d3.select("#histogram").select("svg").selectAll("*").remove();
        return;
    }
    console.log("Data before binGenerator:", data); // Log the data
    const bins = binGenerator(data);

    const containerWidth = d3.select("#histogram").node().getBoundingClientRect().width;
    const innerWidth = containerWidth - margin.left - margin.right;
    xScale.range([0, innerWidth]);

    xScale.domain([d3.min(bins, d => d.x0), d3.max(bins, d => d.x1)]);
    yScale.domain([0, d3.max(bins, d => d.length)]);

    const svgElement = d3.select("#histogram").select("svg").select("g");

    const bars = svgElement.selectAll(".bar")
        .data(bins);

    bars.exit()
        .transition()
        .duration(300)
        .attr("height", 0)
        .remove();

    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.x0) + 1)
        .attr("y", d => yScale(d.length))
        .attr("width", d => xScale(d.x1) - xScale(d.x0) - 1)
        .attr("height", 0)
        .attr("fill", colors.barColor)
        .transition()
        .duration(300)
        .attr("y", d => yScale(d.length))
        .attr("height", d => height - yScale(d.length));

    xAxisGroup.transition().duration(300).call(d3.axisBottom(xScale));
    yAxisGroup.transition().duration(300).call(d3.axisLeft(yScale));

    svgElement.select(".x-axis-label")
        .attr("x", innerWidth / 2);
}

function drawScatterplot(data) {
    console.log("drawScatterplot received data with", data.length, "items"); // Added log
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

    const maxStarRating = d3.max(data, d => +d.star);
    const maxEnergyConsumption = d3.max(data, d => +d.energyConsumption);

    xScaleS.domain([0, maxStarRating]);
    yScaleS.domain([0, maxEnergyConsumption]);

    innerChartS.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("r", 5)
        .attr("fill", d => colorScale(d.screenTech))
        .attr("opacity", 0.7)
        .attr("cx", d => xScaleS(+d.star))
        .attr("cy", d => yScaleS(+d.energyConsumption))
        .on("mouseenter", handleMouseEvents)
        .on("mouseleave", handleMouseLeave);

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

function createTooltip() {
    const tooltip = d3.select("#scatterplot").select("svg").select("g")
        .append("g")
        .attr("class", "tooltip")
        .style("opacity", 0);

    tooltip.append("rect")
        .attr("width", tooltipSize.width)
        .attr("height", tooltipSize.height)
        .attr("fill", colors.barColor)
        .style("opacity", 0.8)
        .attr("rx", 5)
        .attr("ry", 5);

    tooltip.append("text")
        .attr("x", tooltipSize.width / 2)
        .attr("y", tooltipSize.height / 2)
        .attr("dy", "0.35em")
        .style("text-anchor", "middle")
        .attr("fill", "#f1faee");

    window.tooltipElement = tooltip;
}

function handleMouseEvents(e, d) {
    if (!window.tooltipElement) return;

    const tooltip = window.tooltipElement;

    tooltip.select("text")
        .text(`${d.screenSize} inches`);

    const circle = d3.select(e.currentTarget);
    const cx = +circle.attr("cx");
    const cy = +circle.attr("cy");

    const xPosition = cx + marginS.left + 10;
    const yPosition = cy + marginS.top - 15;

    tooltip.attr("transform", `translate(${xPosition}, ${yPosition})`);

    tooltip.transition()
        .duration(200)
        .style("opacity", 1);
}

function handleMouseLeave() {
    if (!window.tooltipElement) return;

    const tooltip = window.tooltipElement;
    tooltip.transition()
        .duration(200)
        .style("opacity", 0)
        .attr("transform", `translate(-100, -100)`);
}

function setupScatterplotInteraction() {
    d3.select("#scatterplot").select("svg").select("g")
        .selectAll("circle")
        .on("mouseenter", handleMouseEvents)
        .on("mouseleave", handleMouseLeave);
}

window.addEventListener('resize', () => {
    const loadedData = window.histogramData;
    const activeButton = d3.select(".filter-button.active");
    const activeFilterId = activeButton.datum() ? activeButton.datum().id : "all";

    if (loadedData) {
        const filteredData = filterData(loadedData, activeFilterId); // Apply current filter on resize
        drawHistogram(filteredData);
        drawScatterplot(filteredData);
    }
});