import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

const BarChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!Array.isArray(data)) {
            console.error('Data is not an array:', data);
            return;
        }

        const processedData = d3.rollups(
            data,
            v => d3.mean(v, d => d.intensity || 0),
            d => d.sector && d.sector !== 'none' ? d.sector : 'Unknown'
        ).map(([sector, intensity]) => ({ sector, intensity }));

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 600;
        const height = 400;
        const margin = { top: 20, right: 20, bottom: 50, left: 70 };

        const x = d3.scaleBand()
            .range([margin.left, width - margin.right])
            .padding(0.3)
            .domain(processedData.map(d => d.sector));

        const maxIntensity = d3.max(processedData, d => d.intensity);
        const y = d3.scaleLinear()
            .range([height - margin.bottom, margin.top])
            .domain([0, maxIntensity * 1.1]);

        const xAxis = svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("fill", "white")
            .attr("text-anchor", "middle");

        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background-color', 'rgba(0, 0, 0, 0.75)')
            .style('color', '#fff')
            .style('padding', '5px 10px')
            .style('border-radius', '4px')
            .style('pointer-events', 'none')
            .style('opacity', 0);

        xAxis.each(function () {
            const textElement = d3.select(this);
            const fullText = textElement.text();

            if (textElement.node().getBBox().width > x.bandwidth()) {
                textElement.text(fullText.length > 3 ? `${fullText.slice(0, 3)}` : fullText);

                textElement.on('mouseover', function (event) {
                    tooltip.transition().duration(200).style('opacity', 1);
                    tooltip.html(fullText);

                    const tooltipWidth = tooltip.node().offsetWidth;
                    const pageWidth = window.innerWidth;

                    let left = event.pageX + 10;
                    if (left + tooltipWidth > pageWidth) {
                        left = event.pageX - tooltipWidth - 10;
                    }

                    tooltip.style('left', `${left}px`)
                        .style('top', `${event.pageY - 25}px`);
                })
                .on('mousemove', function (event) {
                    const tooltipWidth = tooltip.node().offsetWidth;
                    const pageWidth = window.innerWidth;

                    let left = event.pageX + 10;
                    if (left + tooltipWidth > pageWidth) {
                        left = event.pageX - tooltipWidth - 10;
                    }

                    tooltip.style('left', `${left}px`)
                        .style('top', `${event.pageY - 25}px`);
                })
                .on('mouseout', function () {
                    tooltip.transition().duration(200).style('opacity', 0);
                });
            }
        });

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .selectAll("text")
            .attr("fill", "#fff");

   
        svg.selectAll(".bar")
            .data(processedData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.sector))
            .attr("y", height - margin.bottom)
            .attr("width", x.bandwidth())
            .attr("height", 0)
            .attr("fill", (d, i) => d3.schemeCategory10[i % 10])
            .attr("fill-opacity", 0.7)  
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .transition()
            .duration(800)
            .attr("y", d => y(d.intensity))
            .attr("height", d => height - margin.bottom - y(d.intensity))
            .ease(d3.easeBounceOut);

        svg.selectAll(".bar")
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("fill-opacity", 1)  
                    .attr("transform", "scale(1.05)");  

                tooltip.transition().duration(200).style('opacity', 1);
                tooltip.html(`Sector: ${d.sector}<br>Average Intensity: ${d.intensity.toFixed(2)}`);

                const tooltipWidth = tooltip.node().offsetWidth;
                const pageWidth = window.innerWidth;

                let left = event.pageX + 10;
                if (left + tooltipWidth > pageWidth) {
                    left = event.pageX - tooltipWidth - 10;
                }

                tooltip.style('left', `${left}px`)
                    .style('top', `${event.pageY - 25}px`);
            })
            .on("mousemove", function (event) {
                const tooltipWidth = tooltip.node().offsetWidth;
                const pageWidth = window.innerWidth;

                let left = event.pageX + 10;
                if (left + tooltipWidth > pageWidth) {
                    left = event.pageX - tooltipWidth - 10;
                }

                tooltip.style('left', `${left}px`)
                    .style('top', `${event.pageY - 25}px`);
            })
            .on("mouseout", function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("fill-opacity", 0.7)  
                    .attr("transform", "scale(1)");  

                tooltip.transition().duration(200).style('opacity', 0);
            });

        svg.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y)
                .ticks(10)
                .tickFormat('')
            )
            .selectAll("line")
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5);

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")
            .attr("fill", "#fff")
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .text("Average Intensity by Sector");

        return () => {
            tooltip.remove();
        };
    }, [data]);

    return (
        <svg ref={svgRef} width="600" height="400"></svg>
    );
};

BarChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        sector: PropTypes.string,
        intensity: PropTypes.number
    }))
};

export default BarChart;
