import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import './Filter.css'; // Import the CSS file with scrollbar styles

const Filter = ({ filters, setFilters, data }) => {
    const [uniqueValues, setUniqueValues] = useState({
        end_year: [],
        topic: [],
        sector: [],
        region: [],
        pestle: [],
        source: [],
        country: [],
    });

    useEffect(() => {
        if (!Array.isArray(data)) {
            console.error('Data is not an array or is undefined:', data);
            return;
        }

        const getUniqueValues = (key) => {
            return [...new Set(data.map(item => item[key] || ''))].sort();
        };

        setUniqueValues({
            end_year: getUniqueValues('end_year'),
            topic: getUniqueValues('topic'),
            sector: getUniqueValues('sector'),
            region: getUniqueValues('region'),
            pestle: getUniqueValues('pestle'),
            source: getUniqueValues('source'),
            country: getUniqueValues('country'),
        });
    }, [data]);

    const getFilteredOptions = (key) => {
        const selectedFilters = { ...filters };
        delete selectedFilters[key];

        return uniqueValues[key].filter(value => {
            return data.some(item => {
                return Object.keys(selectedFilters).every(filterKey => {
                    return !selectedFilters[filterKey] || item[filterKey] === selectedFilters[filterKey];
                }) && item[key] === value;
            });
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (value === '') {
            const updatedFilters = { ...filters };
            delete updatedFilters[name];
            setFilters(updatedFilters);
        } else {
            setFilters(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div className="flex flex-wrap border-none rounded-lg mb-6  gap-4">
            {['end_year', 'topic', 'sector', 'region', 'pestle', 'source', 'country'].map(key => (
                <div key={key} className="w-[150px]">
                    <label className="block mb-2 text-sm font-semibold text-gray-300">
                        {key.replace('_', ' ').toUpperCase()}
                    </label>
                    <select
                        className="custom-dropdown"  
                        name={key}
                        value={filters[key] || ''}
                        onChange={handleChange}
                    >
                        <option value="">Select {key.replace('_', ' ')}</option>
                        {getFilteredOptions(key).map((value, index) => (
                            <option key={index} value={value}>{value}</option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
};

export default Filter;

Filter.propTypes = {
    filters: PropTypes.object,
    setFilters: PropTypes.func,
    data: PropTypes.array
};
