import { useEffect, useState } from "react";
import Login from "./Login.jsx";

function TopButtons({ setQuery, isLoggedIn, setIsLoggedIn }) {
    const [cities, setCities] = useState([]);
    const [translatedCities, setTranslatedCities] = useState([]);

    useEffect(() => {
        // Получаем последние запросы из базы
        fetch("http://localhost:4002/api/recent-cities")
            .then((response) => response.json())
            .then((data) => {
                setCities(data);
                translateCities(data); // Переводим города на русский
            })
            .catch((error) => console.error("Error fetching recent cities:", error));
    }, []);

    const translateCities = async (cities) => {
        const translations = await Promise.all(
            cities.map(async (city) => {
                const translatedName = await translateToRussian(city.name);
                return {
                    ...city,
                    translatedName: capitalizeWords(translatedName),
                };
            })
        );
        setTranslatedCities(translations);
    };

    const translateToRussian = async (text) => {
        try {
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
                    text
                )}&langpair=en|ru`
            );
            const data = await response.json();
            return data.responseData.translatedText || text;
        } catch (error) {
            console.error("Error translating text:", error);
            return text; // Если произошла ошибка, возвращаем оригинальный текст
        }
    };

    const capitalizeWords = (text) => {
        return text
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    return (
        <div className="flex justify-between items-center py-4">
            {translatedCities.map((city, index) => (
                <button
                    key={index}
                    className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-lg hover:bg-cyan-600 transition transform hover:scale-105"
                    onClick={() => setQuery({ q: city.name })}
                >
                    {city.translatedName}
                </button>
            ))}
            <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </div>
    );
}

export default TopButtons;
