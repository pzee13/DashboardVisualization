import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

const IntensityPieChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!Array.isArray(data)) {
            console.error('Data is not an array:', data);
            return;
        }

    
        const intensityData = d3.rollups(
            data,
            v => d3.mean(v, d => d.intensity || 0),
            d => d.pestle || 'Unknown'
        ).map(([pestle, avgIntensity]) => ({ pestle, avgIntensity }));

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 385;
        const height = 385;
        const radius = Math.min(width, height) / 2;

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const pie = d3.pie().value(d => d.avgIntensity);
        const arc = d3.arc().outerRadius(radius - 10).innerRadius(0);

        const arcs = svg.append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`)
            .selectAll(".arc")
            .data(pie(intensityData))
            .enter().append("g")
            .attr("class", "arc");

        arcs.append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.pestle))
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
                tooltip.html(`Average Intensity: ${d.data.avgIntensity.toFixed(2)}`)
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
            .style("font-size", "12px") // Adjust text size if needed
            .text(d => d.data.pestle)
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

IntensityPieChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        intensity: PropTypes.number,
        pestle: PropTypes.string
    })).isRequired
};

export default IntensityPieChart;
