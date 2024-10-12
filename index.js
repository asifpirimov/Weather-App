import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// MiddleWare
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Render the index page with default values for weather and error
app.get("/", (req, res) => {
    // On initial load, render with no weather and an empty weatherType
    res.render("index", { weather: null, error: null, weatherType: "" });
});


// Fetch weather data from OpenWeatherMap
app.get("/weather", async (req, res) => {
    const api_key = "0e961f94b30529b902944938dd8dbb65";
    const city = req.query.city;

    if (!city) {
        return res.render("index", { weather: null, error: "Please enter a city name", weatherType: "" });
    }

    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`;

    try {
        const response = await axios.get(url);
        const weatherData = response.data;

        if (weatherData.main) {
            const weather = {
                city: weatherData.name,
                temperature: weatherData.main.temp,
                description: weatherData.weather[0].description,
                icon: weatherData.weather[0].icon
            };

            // Determine weather type for background animation
            let weatherType = 'sunny'; // default
            if (weather.description.includes("cloud")) {
                weatherType = 'cloudy';
            } else if (weather.description.includes("rain")) {
                weatherType = 'rainy';
            }

            res.render("index", { weather: weather, error: null, weatherType: weatherType });
        } else {
            res.render("index", { weather: null, error: "City not found", weatherType: "" });
        }
    } catch (error) {
        res.render("index", { weather: null, error: "Error fetching data from the weather service", weatherType: "" });
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
