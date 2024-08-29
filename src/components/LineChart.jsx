// src/components/LineChart.js
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

const LineChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!Array.isArray(data)) {
            console.error('Data is not an array:', data);
            return;
        }

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 600;
        const height = 400;
        const margin = { top: 20, right: 20, bottom: 30, left: 50 };

        const x = d3.scaleTime().range([margin.left, width - margin.right]);
        const y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

        const line = d3.line()
            .x(d => x(new Date(d.start_year || 0)))
            .y(d => y(d.intensity || 0));

        x.domain(d3.extent(data, d => new Date(d.start_year || 0)));
        y.domain([0, d3.max(data, d => d.intensity || 0)]);

        svg.append("path")
            .data([data])
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .attr("stroke", "steelblue")
            .call(d3.axisBottom(x).ticks(5));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .attr("stroke", "steelblue")
            .call(d3.axisLeft(y));

    }, [data]);

    return (
        <svg ref={svgRef} className="w-full h-full"></svg>
    );
};

LineChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        start_year: PropTypes.string,
        intensity: PropTypes.number
    }))
};

export default LineChart;
