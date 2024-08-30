import { useState, useEffect } from 'react';
import axios from 'axios'; 
import BarChart from './components/Barchart';   
import Filters from './components/Filter';     
import IntensityPieChart from './components/IntensityPieChart';
import Statistics from './components/Statistics';
import DonutChart from './components/DonutChart';
import LikelihoodBarChart from './components/LikelihoodBarChart';
import './App.css'

function App() {
    const [allData, setAllData] = useState([]);  
    const [filteredData, setFilteredData] = useState([]); 
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_API_URL}/api/world-details`)
            .then(response => {
                setAllData(response.data);
                setFilteredData(response.data); 
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('Failed to load data. Please try again later.');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters]);

    const applyFilters = () => {
        let filtered = [...allData];

        // Apply all filters
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                filtered = filtered.filter(item => item[key] === filters[key]);
            }
        });

        setFilteredData(filtered);
    };
    
    const totalSectors = new Set(filteredData.map(item => item.sector)).size;
    const totalCountries = new Set(filteredData.map(item => item.country)).size;
    const totalTopics = new Set(filteredData.map(item => item.topic)).size;


    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

    return (
      <div className="flex min-h-screen ">
         
    {/* Sidebar */}
    <div className="w-full sm:w-1/6 bg-gray-800 text-white p-4 fixed top-0 left-0 h-full">
        <h2 className="text-xl font-bold mt-10 mb-4">Dashboard </h2>
        <p>Created by Aswin P C</p>
    </div>

    {/* Main Content */}
    <div className="w-full h-full sm:w-5/6 bg-black pr-4 pt-4 pl-4 pb-0 ml-auto sm:ml-[16.666667%] h-screen overflow-y-auto scrollbar-hidden ">
        <h1 className="text-2xl text-white font-bold mb-6">Dashboard Visualization</h1>
        <Filters filters={filters} setFilters={setFilters} data={allData} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 p-4 shadow-md rounded-md flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-2 text-white">Average Intensity by PESTLE</h2>
            <div className="flex justify-center">
                <IntensityPieChart data={filteredData} />
            </div>
          </div> 

            <div className="bg-gray-900 p-4 shadow-md rounded-md">
                <h2 className="text-lg font-semibold mb-2"></h2>
                <BarChart data={filteredData} />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black p-4 shadow-md rounded-md flex items-center justify-center">
            <div className="flex flex-col items-center">
                <h2 className="text-lg text-white font-semibold mb-4">Region and impact</h2>
                <DonutChart data={filteredData} />
            </div>
          </div>
          
              <div className="bg-black p-4 shadow-md rounded-md">
                  <h2 className="text-lg font-semibold mb-2">Bar Chart</h2>
                  <Statistics sectors={totalSectors} countries={totalCountries} topics={totalTopics} />
              </div>
              <div className="bg-gray-900 p-4 shadow-md rounded-md">
                <h2 className="text-lg font-semibold mb-2"></h2>
                <LikelihoodBarChart data={filteredData} />
            </div>
        </div>
    </div>
</div>

  );
}

export default App;
