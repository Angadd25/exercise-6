// js/histogram.js
let svg;
let xAxisGroup;
let yAxisGroup;

function drawHistogram(data) {
    const container = d3.select("#histogram");
    container.select("svg").remove();

    const svgWidth = container.node().getBoundingClientRect().width;
    const svgHeight = height + margin.top + margin.bottom;
    const innerWidth = svgWidth - margin.left - margin.right;
    xScale.range([0, innerWidth]);

    svg = container.append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const bins = binGenerator(data);
    console.log("Generated bins:", bins);

    xScale.domain([d3.min(bins, d => d.x0), d3.max(bins, d => d.x1)]);
    yScale.domain([0, d3.max(bins, d => d.length)]);

    svg.selectAll(".bar")
        .data(bins)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.x0) + 1)
        .attr("y", d => yScale(d.length))
        .attr("width", d => xScale(d.x1) - xScale(d.x0) - 1)
        .attr("height", d => height - yScale(d.length))
        .attr("fill", colors.barColor);

    xAxisGroup = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    yAxisGroup = svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale));

    svg.append("text")
        .attr("class", "x-axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", height + margin.bottom - 5)
        .attr("text-anchor", "middle")
        .text("Energy Consumption");

    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Frequency");
}