// js/load-data.js
d3.csv("../data/Ex6_TVdata.csv").then(data => {
    console.log("Data loaded:", data);
    window.histogramData = data;
    drawHistogram(data);
    populateFilters(data);
    drawScatterplot(data);
    createTooltip();
    setupScatterplotInteraction();
}).catch(error => {
    console.error("Error loading data:", error);
});

window.addEventListener('resize', () => {
    const loadedData = window.histogramData;
    const activeButton = d3.select(".filter-button.active");
    const activeFilterId = activeButton.datum() ? activeButton.datum().id : "all";

    if (loadedData) {
        drawHistogram(loadedData);
        updateHistogram(loadedData, activeFilterId);
        drawScatterplot(loadedData); // Redraw scatterplot on resize
    }
});