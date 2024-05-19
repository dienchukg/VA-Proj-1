import * as d3 from "d3";

function drawPcp(data) {
    const margin = {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
    };
    const width = 1050;
    const height = 500;

    const attributes = [
        { name: "year", range: [1995, 2021] },
        { name: "minplayers", range: [1, 3] },
        { name: "maxplayers", range: [2, 8] },
        { name: "minplaytime", range: [5, 240] },
        { name: "maxplaytime", range: [20, 1000] },
        { name: "minage", range: [8, 17] },
        { name: "rating", range: [7.5, 8.8] },
        { name: "num_of_reviews", range: [5157, 96512] },
        { name: "rank", range: [1, 100]}
    ];

    // Unnest the nested data
    data = data.map(game => ({
        ...game,
        rating: game.rating.rating,
        num_of_reviews: game.rating.num_of_reviews
    }));

    const xScale = d3.scalePoint()
        .domain(attributes.map(d => d.name))
        .range([margin.left, width - margin.right]);

    const yScales = {};
    attributes.forEach(d => {
        yScales[d.name] = d3.scaleLinear()
            .domain(d.range)
            .range([height - margin.bottom, margin.top]); // Corrected y range
    });

    const lineGenerator = d3.line();
    const linePath = function(d) {
        const points = attributes.map(attr => [xScale(attr.name), yScales[attr.name](d[attr.name])]);
        return lineGenerator(points);
    };

    // Clear any existing SVG
    d3.select(".pcp").selectAll("*").remove();

    const pcp = d3.select(".pcp")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const gameNameDiv = d3.select(".pcp").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("background-color", "lightblue")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")
        .style("pointer-events", "none");

    function handleMouseOver(event, d) {
        d3.select(this).attr("stroke", "orange");
        
        gameNameDiv.transition().duration(200).style("opacity", 1);
        gameNameDiv.html(`
            <strong>Title:</strong> ${d.title}<br>
            <strong>Rank:</strong> ${d.rank}<br>
            <strong>Number of Reviews:</strong> ${d.num_of_reviews}<br>
            <strong>Rating:</strong> ${d.rating}<br>
            <strong>Min-Max Players:</strong> ${d.minplayers}-${d.maxplayers}<br>
            <strong>Min-Max Playtime:</strong> ${d.minplaytime}-${d.maxplaytime}<br>
            <strong>Year released:</strong> ${d.year}<br>
        `)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    }

    function handleMouseOut(d) {
        d3.select(this).attr("stroke", "steelblue");
        gameNameDiv.transition().duration(500).style("opacity", 0);
    }

    const lineGroup = pcp.append("g")
        .selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("d", d => linePath(d))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

    const featureAxisG = pcp.selectAll('g.feature')
        .data(attributes)
        .enter()
        .append('g')
        .attr('class', 'feature')
        .attr('transform', d => `translate(${xScale(d.name)},0)`);

    featureAxisG.append('g')
        .each(function(d) {
            d3.select(this).call(d3.axisLeft(yScales[d.name]));
        });

    featureAxisG.append('text')
        .attr('y', height - margin.bottom)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text(d => d.name);
    
    // Add brushing
    const brush = d3.brushY()
        .extent([[0, margin.top], [10, height - margin.bottom]])
        .on("start brush", brushed)
        .on("end", brushEnded);

    featureAxisG.append("g")
        .attr("class", "brush")
        .each(function(d) {
            d3.select(this).call(brush);
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

    let actives = [];

    function brushed(event) {
        if (event.selection) {
            actives = attributes.map(d => {
                return {
                    dimension: d.name,
                    extent: event.selection.map(yScales[d.name].invert)
                };
            });
            updateLines();
        }
    }

    function brushEnded(event) {
        if (!event.selection) {
            actives = [];
            updateLines();
        }
    }

    function updateLines() {
        lineGroup.attr("stroke", d => isBrushed(d) ? "steelblue" : "lightgray")
            .attr("stroke-width", d => isBrushed(d) ? 1.5 : 1);
    }

    function isBrushed(d) {
        return actives.every(active => {
            const dim = active.dimension;
            const extent = active.extent;
            return extent[0] <= d[dim] && d[dim] <= extent[1];
        });
    }

    // Toggle brushing
    d3.select("#brushToggle").on("change", function() {
        const toggle = this.checked;
        if (toggle) {
            featureAxisG.selectAll(".brush")
                .each(function() {
                    d3.select(this).call(brush);
                });
        } else {
            featureAxisG.selectAll(".brush").call(brush.move, null);
        }
    });
}

export { drawPcp };
