async function getCityId(city) {
    try {
        const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${city}&format=json&apiKey=b81aa0193fe94a7c97187fb3526e69e1`);
        const data = await response.json();
        console.log(data);

        // Перевіряємо, чи є результати та виводимо ID першого місця
        if (data.results.length > 0) {
            const cityId = data.results[0].place_id;
            console.log("City ID:", cityId);
            // Викликаємо функцію для пошуку місць за ID
            getPlacesByCityId(cityId);
        } else {
            console.log("Місця не знайдено");
        }
    } catch (error) {
        console.log("Помилка при запиті до API:", error);
    }
}

async function getPlacesByCityId(cityId) {
    try {
        const response = await fetch(`https://api.geoapify.com/v2/places?categories=religion&filter=place:${cityId}&limit=2&apiKey=134bb3b4cf78459dabf6a880cdb6fae0`);
        const data = await response.json();
        console.log(data);

        // Перевіряємо, чи є результати та виводимо їх
        if (data.features.length > 0) {
            console.log("Місця:");
            data.features.forEach(place => {
                console.log(place.properties.name);
            });
        } else {
            console.log("Місця не знайдено");
        }
    } catch (error) {
        console.log("Помилка при запиті до API:", error);
    }
}

// Обробник події для кнопки пошуку
document.getElementById('searchButton').addEventListener('click', function() {
    const city = document.getElementById('cityInput').value;
    getCityId(city);
});