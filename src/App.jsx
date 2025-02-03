import React, { useState } from 'react';
import axios from 'axios';
import './index.css';
import ClipLoader from 'react-spinners/ClipLoader';

function App() {
    const [query, setQuery] = useState('');
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [error, setError] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [location, setLocation] = useState('Addis Ababa');
    const [loading, setLoading] = useState(false);
    const [platform, setPlatform] = useState('both');
    const [isSearchPerformed, setIsSearchPerformed] = useState(false);
    const [searchCache, setSearchCache] = useState({});

    const brands = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes'];

    const fetchCars = async () => {
        if (!query) return;

        setLoading(true);
        setIsSearchPerformed(true);

        if (searchCache[query]) {
            setCars(searchCache[query]);
            setFilteredCars(searchCache[query]);
            setLoading(false);
            return;
        }

        try {
            let response = [];

            if (platform === 'mekina' || platform === 'both') {
                const mekinaResponse = await axios.get(`http://localhost:3000/api/cars?platform=mekina&query=${encodeURIComponent(query)}`);
                response = [...response, ...mekinaResponse.data];
            }

            if (platform === 'jiji' || platform === 'both') {
                const jijiResponse = await axios.get(`http://localhost:3000/api/cars?platform=jiji&query=${encodeURIComponent(query)}`);
                response = [...response, ...jijiResponse.data];
            }

            const updatedCars = response.map(car => ({
                ...car,
                location: 'Addis Ababa',
            }));

            setSearchCache(prevCache => ({ ...prevCache, [query]: updatedCars }));

            setCars(updatedCars);
            setFilteredCars(updatedCars);
            setError('');
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to fetch car listings');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchCars();
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark', !darkMode);
    };

    const handleFilter = () => {
        let filtered = cars;

        if (selectedBrand) {
            filtered = filtered.filter(car => car.title.includes(selectedBrand));
        }

        if (minPrice) {
            filtered = filtered.filter(car => {
                const price = parseFloat(car.price.replace(/ETB|[^0-9.-]+/g, "").trim());
                return price >= parseFloat(minPrice);
            });
        }
        if (maxPrice) {
            filtered = filtered.filter(car => {
                const price = parseFloat(car.price.replace(/ETB|[^0-9.-]+/g, "").trim());
                return price <= parseFloat(maxPrice);
            });
        }

        if (location) {
            filtered = filtered.filter(car => car.location && car.location.toLowerCase().includes(location.toLowerCase()));
        }

        setFilteredCars(filtered);
    };

    return (
        <div className={`App min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <header className="p-5 text-center relative">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Search for Cars in Ethiopia</h1>

                <div className="sm:absolute sm:top-5 sm:right-5 sm:mt-0 mt-4 flex justify-center items-center">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 bg-transparent text-white rounded flex items-center"
                    >
                        {darkMode ? (
                            <i className="fas fa-sun text-xl"></i>
                        ) : (
                            <i className="fas fa-moon text-xl text-black"></i>
                        )}
                    </button>
                </div>

                <div className="mt-4 flex justify-center">
                    <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className={`p-2 border-2 rounded mb-2 sm:mb-0 w-full sm:w-1/4 transition-all duration-300 ease-in-out
                        ${darkMode ? 'bg-gray-800 text-white border-gray-600 focus:border-green-400 focus:ring-2 focus:ring-green-500'
                                   : 'bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'}`}
                    >
                        <option value="both">Both Jiji and Mekina</option>
                        <option value="mekina">Mekina.net</option>
                        <option value="jiji">Jiji</option>
                    </select>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row justify-center items-center">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value.trim())}
                        placeholder="Search for cars..."
                        className={`p-2 w-full sm:w-1/3 mb-2 sm:mb-0 border-2 rounded transition-all duration-300 ease-in-out
                        ${darkMode ? 'bg-gray-800 text-white border-gray-600 focus:border-green-400 focus:ring-2 focus:ring-green-500'
                                   : 'bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'}`}
                    />
                    <button
                        onClick={handleSearch}
                        className="ml-2 p-2 bg-green-500 text-white rounded w-full sm:w-auto"
                    >
                        Search
                    </button>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row justify-center items-center">
                    <select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className={`p-2 border-2 rounded mb-2 sm:mb-0 w-full sm:w-1/4 transition-all duration-300 ease-in-out
                        ${darkMode ? 'bg-gray-800 text-white border-gray-600 focus:border-green-400 focus:ring-2 focus:ring-green-500'
                                   : 'bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'}`}
                    >
                        <option value="">Select Brand</option>
                        {brands.map((brand) => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Min Price"
                        className={`p-2 border-2 rounded mb-2 sm:mb-0 w-full sm:w-1/4 transition-all duration-300 ease-in-out
                        ${darkMode ? 'bg-gray-800 text-white border-gray-600 focus:border-green-400 focus:ring-2 focus:ring-green-500'
                                   : 'bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'}`}
                    />
                    <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Max Price"
                        className={`p-2 border-2 rounded mb-2 sm:mb-0 w-full sm:w-1/4 transition-all duration-300 ease-in-out
                        ${darkMode ? 'bg-gray-800 text-white border-gray-600 focus:border-green-400 focus:ring-2 focus:ring-green-500'
                                   : 'bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'}`}
                    />
                    <button
                        onClick={handleFilter}
                        className="ml-2 p-2 bg-blue-500 text-white rounded w-full sm:w-auto"
                    >
                        Apply Filters
                    </button>
                </div>
            </header>

            {loading ? (
                <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                    <ClipLoader loading={loading} size={50} color={darkMode ? '#ffffff' : '#000000'} />
                </div>
            ) : (
                <main className="p-5">
                    {error && <p className="text-red-500">{error}</p>}
                    <div id="results" className="mt-4">
                        {isSearchPerformed && filteredCars.length === 0 ? (
                            <p>No results found.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                {filteredCars.map((car, index) => (
                                    <div
                                        className={`p-4 mb-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                                        key={index}
                                    >
                                        <img src={car.image} alt={car.title} className="mt-2 rounded w-full h-48 object-cover" />
                                        <h2 className="text-xl font-bold">{car.title}</h2>
                                        <p className="text-lg font-semibold">{car.price}</p>
                                        <p className={`text-gray-600 ${darkMode ? 'text-white' : 'text-gray-600'}`}>{car.description}</p>
                                        <p className="text-gray-500">Location: {car.location}</p>
                                        <a href={car.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 mt-2 inline-block">
                                            View Listing
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            )}
        </div>
    );
}

export default App;
