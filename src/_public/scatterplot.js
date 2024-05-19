import * as d3 from "d3"

function draw_scatterplot(data) {
  const boardgames = data.map(game => ({
    ...game,
    players: game.minplayers,
    rating: game.rating.rating,
    reviewsCount: game.rating.num_of_reviews,
    rank: game.rank,
  }));

  console.log('Boardgames:', boardgames);

  // Create scatterplot using D3.js
  const svgWidth = 800;
  const svgHeight = 600;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  const svg = d3.select('body').append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

 /*  const xScale = d3.scaleLinear()
    .domain([0, d3.])/////////// need info
    .range([margin.left, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.])
    .range([height, margin.top]); */


  // Add tooltip div
  const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  
  const circles = svg.selectAll('circle')
    .data(boardgames)
    .enter().append('circle')
    .attr('cx', d => xScale(d.rank))
    .attr('cy', d => yScale(d.reviewsCount))
    .attr('r', d => sizeScale(d.rating))
    .attr('fill', d => colorScale(d.players))
    .on('mouseover', function(event, d) {
      if (!brushingEnabled) {
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`Title: ${d.title}<br/>Rating: ${d.rating}<br/>Reviews: ${d.reviewsCount}<br/>Players: ${d.players}<br/>Rank: ${d.rank}`)
          .style('left', (event.pageX + 5) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      }
    })
    .on('mouseout', function() {
      if (!brushingEnabled) {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      }
    });

  // Add x-axis
  svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  // Add y-axis
  svg.append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale));

  // Add brushing
  const plotAreaWidth = width - margin.left - margin.right;
  const plotAreaHeight = height - margin.top - margin.bottom;

  const brush = d3.brush()
    .extent([[margin.left, margin.top], [width, height]])
    .on('start brush end', brushed);

  const gBrush = svg.append('g')
    .attr('class', 'brush');

  //toggle brushing
  let brushingEnabled = false;
  function toggleBrush() {
    brushingEnabled = !brushingEnabled;
    if (brushingEnabled) {
      gBrush.call(brush);
    } else {
      gBrush.call(brush.move, null);
      gBrush.selectAll(".overlay").remove();
      gBrush.selectAll(".selection").remove();
      gBrush.selectAll(".handle").remove();
      svg.selectAll('circle').classed('selected', false).classed('not-selected', false);
    }
  }
  d3.select('#toggle-brush').on('click', toggleBrush);

  //brushing
  function brushed({ selection }) {
    if (selection) {
      const [[x0, y0], [x1, y1]] = selection;
      svg.selectAll('circle')
        .classed('selected', d =>
          x0 <= xScale(d.rank) && xScale(d.rank) <= x1 &&
          y0 <= yScale(d.reviewsCount) && yScale(d.reviewsCount) <= y1
        )
        .classed('not-selected', d =>
          !(x0 <= xScale(d.rank) && xScale(d.rank) <= x1 &&
            y0 <= yScale(d.reviewsCount) && yScale(d.reviewsCount) <= y1)
        );
    } else {
      svg.selectAll('circle').classed('selected', false).classed('not-selected', false);
    }
  }
}
export {draw_scatterplot};