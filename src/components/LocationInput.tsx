import React, { useState } from 'react'

interface LocationInputProps {
    onSelect: (value: string) => void;
}
function LocationInput({onSelect}:LocationInputProps) {
    const [query, setQuery] = useState(""); // Track user input
    const [suggestions, setSuggestions] = useState([]); // Track autocomplete suggestions
    const [selectedCity, setSelectedCity] = useState("sofia"); // Default city

    // Fetch autocomplete suggestions
    const fetchSuggestions = async (searchQuery: string) => {
        if (searchQuery.length < 3) {
            setSuggestions([]);
            return;
        }

        const API_KEY = "1a8927de54f779e3daeb1932452a3799";
        const response = await fetch(
            `http://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=5&appid=${API_KEY}`
        );
        const results = await response.json();
        setSuggestions(results);
    };

    const handleCitySelect = (city: string) => {
        setSelectedCity(city);
        setQuery(city);
        onSelect(city); 
        setSuggestions([]); 
    };


    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Search for a city"
                className="p-2 m-2 w-full border rounded"
                value={query}
                onChange={(e) => {
                    const value = e.target.value;
                    setQuery(value);
                    fetchSuggestions(value); // Fetch autocomplete suggestions
                }}
            />
            <div className="absolute bg-white border rounded w-full z-10">
                {suggestions.map((suggestion: any, index: number) => (
                    <div
                        key={index}
                        className="p-2 text-blue-300 hover:bg-gray-200 cursor-pointer"
                        onClick={() =>
                            handleCitySelect(
                                `${suggestion.name}, ${suggestion.country}`
                            )
                        }
                    >
                        {suggestion.name}, {suggestion.country}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LocationInput