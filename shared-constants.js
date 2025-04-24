// js/shared-constants.js
const margin = { top: 20, right: 30, bottom: 40, left: 50 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const colors = {
    barColor: 'steelblue',
    axisColor: '#000',
    bodyBackgroundColor: '#f8f9fa'
};

const xScale = d3.scaleLinear().range([0, width]);
const yScale = d3.scaleLinear().range([height, 0]);

const binGenerator = d3.bin()
    .value(d => d.energyConsumption)
    .thresholds(d3.thresholdSturges);

const filters_screen = [
    { id: "all", label: "All", isActive: true },
    { id: "LCD", label: "LCD", isActive: false },
    { id: "LED", label: "LED", isActive: false },
    { id: "OLED", label: "OLED", isActive: false }
];

// Scatterplot specific constants
const marginS = { top: 20, right: 30, bottom: 40, left: 50 };
const widthS = 600 - marginS.left - marginS.right;
const heightS = 400 - marginS.top - marginS.bottom;
let innerChartS;

const xScaleS = d3.scaleLinear().range([0, widthS]);
const yScaleS = d3.scaleLinear().range([heightS, 0]);

const tooltipSize = { width: 80, height: 30 };
const colorScale = d3.scaleOrdinal()
    .domain(["LCD", "LED", "OLED"])
    .range(["#e41a1c", "#377eb8", "#4daf4a"]);