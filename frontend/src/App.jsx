//import './App.css';
import TopButtons from "./components/TopButtons.jsx";
import Inputs from "./components/Input.jsx";
import TimeAndLocation from "./components/TimeAndLocation.jsx";
import TempAndDetails from "./components/TempAndDetails.jsx";
import Forecast from "./components/Forecast.jsx";
import { useEffect, useState } from "react";

function App() {
    const [query, setQuery] = useState({ q: "london" });
    const [units, setUnits] = useState("metric");
    const [weather, setWeather] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const getWeather = async () => {
        const API_BASE_URL = "http://localhost:4000/api";
        const url = new URL(`${API_BASE_URL}/weather`);
        url.search = new URLSearchParams({ ...query, units });

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            
            const data = await response.json();
            setWeather(data);
        } catch (error) {
            console.error("Failed to fetch weather data:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            getWeather();
        }
    }, [query, units]);

    const formatBackground = () => {
        if (!weather) return "from-cyan-600 to-blue-700";
        const threshold = units === "metric" ? 20 : 60;
        return weather.temp <= threshold ? "from-cyan-600 to-blue-700" : "from-yellow-600 to-orange-700";
    };


    return (
        <>
            <div className={`mx-auto max-w-screen-lg mt-4 py-5 px-8 bg-gradient-to-br shadow-xl shadow-gray-400 rounded-xl transition-all  ${formatBackground()}`}>
                <TopButtons setQuery={setQuery}  isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                {!isLoggedIn && (
                    <p className="text-center mt-20 text-xl text-white">Please log in to view the app.</p>
                )}
                {isLoggedIn && (
                    <>
                        <Inputs setQuery={setQuery} setUnits={setUnits} />
                        {weather && (
                            <>
                                <TimeAndLocation weather={weather} />
                                <TempAndDetails weather={weather} units={units} />
                                <Forecast title="3 hours step forecast" data={weather.hourly} />
                                <Forecast title="daily step forecast" data={weather.daily} />
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default App;
