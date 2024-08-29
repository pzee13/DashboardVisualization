import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';




const HeatmapCalendar = ({ data }) => {
    const transformData = (data) => {
        return data.map(doc => {
            const date = new Date(doc.published);
            const day = date.getDay(); // Sunday = 0, Monday = 1, etc.
            const week = Math.floor(date.getDate() / 7); // 0-based week index
            
            return {
                date: doc.published,
                day,
                week,
                value: doc.intensity || 0 // Use intensity or any other metric
            };
        });
    };
    
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 800;
        const height = 400;
        const cellSize = 20;
        const daysInWeek = 7;
        const weeksInMonth = 5;

        const colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, d3.max(data, d => d.value)]);

        const x = d3.scaleBand()
            .range([0, width])
            .domain(d3.range(daysInWeek));

        const y = d3.scaleBand()
            .range([0, height])
            .domain(d3.range(weeksInMonth));

        svg.attr("width", width)
            .attr("height", height);

        svg.selectAll(".cell")
            .data(data)
            .enter().append("rect")
            .attr("class", "cell")
            .attr("x", d => x(d.day))
            .attr("y", d => y(d.week))
            .attr("width", cellSize)
            .attr("height", cellSize)
            .style("fill", d => colorScale(d.value))
            .style("stroke", "#fff");

        svg.selectAll(".cell")
            .on("mouseover", function (event, d) {
                d3.select(this).style("stroke", "#000");
                d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("position", "absolute")
                    .style("background-color", "rgba(0,0,0,0.7)")
                    .style("color", "#fff")
                    .style("padding", "5px")
                    .style("border-radius", "4px")
                    .html(`Date: ${d.date}<br>Value: ${d.value}`)
                    .style("left", `${event.pageX + 5}px`)
                    .style("top", `${event.pageY - 28}px`);
            })
            .on("mouseout", function () {
                d3.select(this).style("stroke", "#fff");
                d3.select(".tooltip").remove();
            });

        // Adding week and day labels
        const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        svg.selectAll(".day-label")
            .data(dayLabels)
            .enter().append("text")
            .attr("class", "day-label")
            .attr("x", (d, i) => x(i) + cellSize / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .text(d => d);

        svg.selectAll(".week-label")
            .data(d3.range(weeksInMonth))
            .enter().append("text")
            .attr("class", "week-label")
            .attr("x", -20)
            .attr("y", (d, i) => y(i) + cellSize / 2)
            .attr("text-anchor", "middle")
            .text(d => `W${d + 1}`);
    }, [data]);

    return (
        <svg ref={svgRef}></svg>
    );
};

HeatmapCalendar.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string,
        day: PropTypes.number,
        week: PropTypes.number,
        value: PropTypes.number
    }))
};

export default HeatmapCalendar;
