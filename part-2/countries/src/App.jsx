import React, { useEffect, useState } from "react";
import axios from 'axios'
const Filter = ({getCountry}) => {
  const [country, setCountry] = useState("");
  const [weather, setWeather] = useState(null);
  const APiKey = "6023d2c3eddc2cadc00d3ffb65c70f2d";
 
  
  const names = getCountry ? getCountry.map((e) => {
    return {
      country: e.name.common,
      capital:e.capital,
      flags:e.flags,
      area: e.area,
      languages: e.languages,
      capitalInfo:e.capitalInfo,
      maps:e.maps
    };
  }).filter(Boolean) : []

  
 let searchedCountries= []
  const handleChange = (value) => {
    setCountry(value.target.value);
  };

  const handelClick = (data) => {
    setCountry(data.country);
  }
    

  searchedCountries = country ? names.filter((e) => {
    return e.country.toLowerCase().includes(country.toLowerCase());
  }).filter(Boolean) : []
 // console.log(searchedCountries)

   useEffect(() => {
     if (searchedCountries.length === 1) {
       const selected = searchedCountries[0];
       const [lat, lon] = selected.capitalInfo.latlng;

       axios
         .get(
           `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APiKey}&units=metric`
         )
         .then((res) => {
           setWeather(res.data);
         })
         .catch((e) => console.log(e));
     } else {
       setWeather(null); 
     }
   }, [searchedCountries]);
 
  return (
    <div>
    <form>
      <label>find countries </label>
      <input value={country} onChange={handleChange} />
      </form>
      {searchedCountries.length > 10 ? "to many country please update filter" : searchedCountries.length > 1 ? searchedCountries.map((e) => {
        return (
          <li key={e.country}>
            {e.country} <button onClick={() => handelClick(e)}>Show</button>
          </li>
        );
      }) : searchedCountries.map((data) => {
        return (
          <>
            <h2>{data.country}</h2>
            <li> Capital {data.capital}</li>
            <li> Area {data.area}</li>
            <h2> languages</h2>
            <ul>
              {Object.values(data.languages).map((lang) => (
                <li key={lang}>{lang}</li>
              ))}
            </ul>
            <img src={data.flags.png} alt={data.flags.alt} />
            {weather ? (
              <>
                <h3>Weather in {data.capital}</h3>
                <p>Temperature: {weather.main.temp} °C</p>
                <p>Condition: {weather.weather[0].description}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt="weather icon"
                />
              </>
            ) : (
              <p>Loading weather...</p>
            )}
          </>
        );
      })}
    </div>
  );
};

const App = () => {
  const [getCountry, setGetCountry] = useState("");
   useEffect(() => {
     axios
       .get("https://studies.cs.helsinki.fi/restcountries/api/all")
       .then((response) => {
         setGetCountry(response.data);
        console.log(response.data[0])
       }).catch((e) => {
         console.log(e)
       })
       ;
   }, []);
     
  return (
    <>
      <Filter getCountry={getCountry} />
    </>
  );
};

export default App;
