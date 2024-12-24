import { BiSearch, BiCurrentLocation } from "react-icons/bi";
import { useState } from "react";

function Inputs({ setQuery, setUnits }) {
    const [city, setCity] = useState('');

    const handleSearch = () => {
        if (city !== "") {
            setQuery({ q: city });
            saveCity(city); // Сохраняем город в базе
        }
    };

    const saveCity = (cityName) => {
        fetch('http://localhost:4002/api/save-city', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: cityName }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                console.log(response);
                return response.json(); // Если сервер не возвращает JSON, может быть пустой ответ.
            })
            .then((data) => console.log("City saved:", data))
            .catch((error) => console.error("Error saving city:", error));
    };

    const geolocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setQuery({ lat: latitude, lng: longitude });
            });
        }
    };

    return (
        <div className="flex flex-row justify-center my-6">
            <div className="flex flex-row w-3/4 items-center justify-center space-x-4">
                <input
                    value={city}
                    onChange={(e) => {
                        setCity(e.currentTarget.value);
                    }}
                    type="text"
                    placeholder="Search"
                    className="text-gray-500 text-xl font-light p-2 w-full shadow-xl capitalize focus:outline-none focus:shadow-outline"
                />
                <BiSearch
                    size={30}
                    className="cursor-pointer transition ease-out hover:scale-125"
                    onClick={handleSearch}
                />
                <BiCurrentLocation
                    size={30}
                    className="cursor-pointer transition ease-out hover:scale-125"
                    onClick={geolocation}
                />
            </div>
            <div className="flex flex-row w-1/4 items-center justify-center">
                <button
                    className="text-2xl font-medium transition ease-out hover:scale-125"
                    onClick={() => {
                        setUnits('metric');
                    }}
                >
                    °С
                </button>
                <p className="text-2xl font-medium mx-1">|</p>
                <button
                    className="text-2xl font-medium transition ease-out hover:scale-125"
                    onClick={() => {
                        setUnits('imperial');
                    }}
                >
                    °F
                </button>
            </div>
        </div>
    );
}

export default Inputs;