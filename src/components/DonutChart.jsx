import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

const DonutChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!Array.isArray(data)) {
            console.error('Data is not an array:', data);
            return;
        }

   
        const impactData = d3.rollups(
            data,
            v => d3.mean(v, d => d.impact || 0),
            d => d.region || 'Unknown'
        ).map(([region, avgImpact]) => ({ region, avgImpact })).filter(d => d.avgImpact > 0);

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 400;
        const height = 400;
        const radius = Math.min(width, height) / 2;
        const innerRadius = radius / 2; 

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const pie = d3.pie().value(d => d.avgImpact);
        const arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(innerRadius);

        const arcs = svg.append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`)
            .selectAll(".arc")
            .data(pie(impactData))
            .enter().append("g")
            .attr("class", "arc");

        arcs.append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.region))
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .style("opacity", 0.8)
            .style("filter", "drop-shadow(0 0 5px rgba(0, 0, 0, 0.5))")
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .transition().duration(300)
                    .style("opacity", 1)
                    .style("transform", "scale(1.1)");

                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(`Average Impact: ${d.data.avgImpact.toFixed(2)}`)
                    .style("left", `${event.pageX + 5}px`)
                    .style("top", `${event.pageY - 28}px`);
            })
            .on("mousemove", function(event) {
                tooltip.style("left", `${event.pageX + 5}px`)
                    .style("top", `${event.pageY - 28}px`);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition().duration(300)
                    .style("opacity", 0.8)
                    .style("transform", "scale(1)");

                tooltip.transition().duration(200).style("opacity", 0);
            });

        arcs.append("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .attr("fill", "#fff")
            .style("font-size", "12px") 
            .text(d => d.data.region)
            .style("opacity", 0.7);

        // Tooltip setup
        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background-color', 'rgba(0, 0, 0, 0.75)')
            .style('color', '#fff')
            .style('padding', '5px 10px')
            .style('border-radius', '4px')
            .style('pointer-events', 'none')
            .style('opacity', 0);

        return () => {
            tooltip.remove();
        };
    }, [data]);

    return (
        <svg ref={svgRef} width="400" height="400"></svg>
    );
};

DonutChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        impact: PropTypes.number,
        region: PropTypes.string
    })).isRequired
};

export default DonutChart;
