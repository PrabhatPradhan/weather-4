import React, { useState } from "react";

const api = {
  key: "114b3591e2ce4f5ba04164957242710",
  base: "https://api.weatherapi.com/v1/",
};

const Weather = () => {
  const [searchCity, setSearchCity] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);

  const cities = ["Mumbai", "Pune", "Delhi", "Bangalore"];
  const [fetchedCities, setFetchedCities] = useState(new Set()); 

  const apifetch = async (city) => {
    try {
      const response = await fetch(
        `${api.base}current.json?key=${api.key}&q=${city}`
      );
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      setWeatherData((prevData) => [
        ...prevData,
        { ...data, isEditing: false },
      ]);
      setFetchedCities((prev) => new Set(prev).add(city));
      console.log(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleChange = (e) => {
    setSearchCity(e.target.value);
  };

  const searchBtn = () => {
    if (searchCity.trim() !== "") {
      apifetch(searchCity);
    }
  };

  const getNextCityWeather = () => {
    if (currentCityIndex < cities.length) {
      const city = cities[currentCityIndex];
      apifetch(city);
      setCurrentCityIndex((prevIndex) => prevIndex + 1);
    }
  };

  const deleteBtn = (index) => {
    setWeatherData((prevData) => prevData.filter((_, i) => i !== index));
    const cityName = weatherData[index].location.name;
    setFetchedCities((prev) => {
      const updatedCities = new Set(prev);
      updatedCities.delete(cityName); 
      return updatedCities;
    });
  };

  const toggleEdit = (index) => {
    setWeatherData((prevData) =>
      prevData.map((data, i) =>
        i === index ? { ...data, isEditing: !data.isEditing } : data
      )
    );
  };

  const handleDescriptionChange = (index, newDescription) => {
    setWeatherData((prevData) =>
      prevData.map((data, i) =>
        i === index
          ? {
              ...data,
              current: {
                ...data.current,
                condition: { text: newDescription },
              },
            }
          : data
      )
    );
  };

  return (
    <>
      <div className="h-[90vh] ">
        <h1>Weather App</h1>
        <div className="flex gap-24 mt-8 justify-center">
          <div className="">
            <button className="px-4 py-2 bg-green-400" onClick={getNextCityWeather}>
              Get Weather
            </button>
            {cities.map((city) => (
              <p
                key={city}
                className={`border px-2 py-2 ${
                  fetchedCities.has(city) ? "border-green-500" : "border-green-300"
                }`}
              >
                {city}
              </p>
            ))}
          </div>
          <div className="">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search city"
                onChange={handleChange}
                value={searchCity}
                className="border rounded-md w-[620px] border-green-400 bg-green-200 text-xl p-2"
              />
              <button
                className="border text-xl px-4 py-2 border-green-400 bg-green-400"
                onClick={searchBtn}
              >
                Search
              </button>
            </div>
            <div className="flex justify-center items-center">
              {weatherData.length > 0 && (
                <div>
                  <table className="table-auto border-collapse border border-gray-500 mt-8">
                    <thead>
                      <tr>
                        <th className="border border-gray-500 px-4 py-2">City</th>
                        <th className="border border-gray-500 px-4 py-2">Description</th>
                        <th className="border border-gray-500 px-4 py-2">Temperature (°C)</th>
                        <th className="border border-gray-500 px-4 py-2">Pressure (mb)</th>
                        <th className="border border-gray-500 px-4 py-2">Visibility (miles)</th>
                        <th className="border border-gray-500 px-4 py-2">❌</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weatherData.map((data, index) => (
                        <tr key={index}>
                          <td className="border border-gray-500 px-4 py-2">{data.location.name}</td>
                          <td className="border border-gray-500 px-4 py-2">
                            {data.isEditing ? (
                              <input
                                type="text"
                                value={data.current.condition.text}
                                onChange={(e) =>
                                  handleDescriptionChange(index, e.target.value)
                                }
                                onBlur={() => toggleEdit(index)}
                                className="border p-1"
                              />
                            ) : (
                              <span onClick={() => toggleEdit(index)}>
                                {data.current.condition.text}
                              </span>
                            )}
                          </td>
                          <td className="border border-gray-500 px-4 py-2">{data.current.temp_c}°C</td>
                          <td className="border border-gray-500 px-4 py-2">{data.current.pressure_mb}</td>
                          <td className="border border-gray-500 px-4 py-2">{data.current.vis_miles}</td>
                          <td className="border border-gray-500 px-4 py-2 text-center">
                            <button onClick={() => deleteBtn(index)}>❌</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Weather;
