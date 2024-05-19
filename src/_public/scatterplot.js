import * as d3 from "d3";
function draw_scatterplot(data) {
  // Define dimensions and margins for the scatterplot
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Create an SVG element
  const svg = d3.select("#scatterplot")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create scales for x and y axes
  const x = d3.scaleLinear()
    .domain([d3.min(data, d => d.x) - 0.1, d3.max(data, d => d.x) + 0.1])
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([d3.min(data, d => d.y) - 0.1, d3.max(data, d => d.y) + 0.1])
    .range([height, 0]);

  // Create axes
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  // Add x-axis to the SVG
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

  // Add y-axis to the SVG
  svg.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

  // Create circles for data points
  svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", d => x(d.x))
    .attr("cy", d => y(d.y))
    .attr("r", 3);

  // Add labels for data points
  svg.selectAll(null)
    .data(data)
    .enter().append("text")
    .attr("x", d => x(d.x) + 5)
    .attr("y", d => y(d.y) - 5)
    .text(d => d.label)
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("fill", "black");
}


export { draw_scatterplot };
