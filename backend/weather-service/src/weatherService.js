import fetch from 'node-fetch';
import { DateTime } from 'luxon';

//const API_KEY = process.env.API_KEY;
const BASIC_URL = 'https://api.openweathermap.org/data/2.5/';
const API_KEY = '9f5f435719969f5fe5f398fc3a59b88e';


const getWeatherData = async (infoType, searchParams) => {
  const url = new URL(BASIC_URL + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${infoType}: ${response.statusText}`);
    
  }
  return response.json();
};

const iconUrlFromCode = (icon) => `http://openweathermap.org/img/wn/${icon}@2x.png`;

const formatToLocalTime = (secs, offset, format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a") =>
  DateTime.fromSeconds(secs + offset, { zone: 'utc' }).toFormat(format);

const formatCurrent = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
    timezone,
  } = data;

  const { main: details, icon } = weather[0];
  return {
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    country,
    sunrise: formatToLocalTime(sunrise, timezone, 'hh:mm a'),
    sunset: formatToLocalTime(sunset, timezone, 'hh:mm a'),
    speed,
    details,
    icon: iconUrlFromCode(icon),
    formattedLocalTime: formatToLocalTime(dt, timezone),
    dt,
    timezone,
    lat,
    lon,
  };
};

const formatForecastWeather = (secs, offset, data) => {
  const hourly = data
    .filter((f) => f.dt > secs)
    .map((f) => ({
      temp: f.main.temp,
      title: formatToLocalTime(f.dt, offset, 'hh:mm a'),
      icon: iconUrlFromCode(f.weather[0].icon),
      data: f.dt_txt,
    }))
    .slice(0, 5);

  const daily = data
    .filter((f) => f.dt_txt.slice(-8) === '00:00:00')
    .map((f) => ({
      temp: f.main.temp,
      title: formatToLocalTime(f.dt, offset, 'cccc'),
      icon: iconUrlFromCode(f.weather[0].icon),
      data: f.dt_txt,
    }));

  return { hourly, daily };
};

export const getFormattedData = async (searchParams) => {
  const formattedData = await getWeatherData('weather', searchParams).then(formatCurrent);

  const { dt, lat, lon, timezone } = formattedData;

  const formattedForecast = await getWeatherData('forecast', { lat, lon, units: searchParams.units }).then((d) =>
    formatForecastWeather(dt, timezone, d.list)
  );

  return { ...formattedData, ...formattedForecast };
};
