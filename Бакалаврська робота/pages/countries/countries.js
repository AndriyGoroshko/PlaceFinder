const geocodeAPIKey = 'b81aa0193fe94a7c97187fb3526e69e1';
const placesAPIKey = '134bb3b4cf78459dabf6a880cdb6fae0';

async function displayPlaces(data) {
    const placesListContainer = document.getElementById('placesList');
    placesListContainer.innerHTML = ''; // Очищуємо контейнер перед додаванням нових елементів

    if (data.features.length > 0) {
        data.features.forEach(place => {
            // Створюємо контейнер для списку місць
            const placesList = document.createElement('ul');
            const placeItem = document.createElement('li');
            const placeName = document.createElement('span');

            // Отримуємо і встановлюємо оригінальну назву місця
            const originalPlaceName = place.properties.name;
            placeName.textContent = originalPlaceName;
            
            placeItem.appendChild(placeName);
            placesList.appendChild(placeItem);
            placesListContainer.appendChild(placesList); // Додаємо список на сторінку

            // Додаємо карту для кожного місця
            createMap(place);

            const OpenHours = document.createElement('p');
            OpenHours.textContent = 'Робочий графік:';
            const OpenHoursinfo = document.createElement('a');
            if (place.properties.opening_hours === undefined) {
                OpenHoursinfo.textContent = "Нажаль інформація про це відсутня";
            } else {
                OpenHoursinfo.textContent = place.properties.opening_hours;
            }

            // Створюємо текст та посилання
            const detailsText = document.createElement('p');
            detailsText.textContent = 'Детальну інформацію можна переглянути за посиланням:';
            const websiteLink = document.createElement('a');
            if (place.properties.website === undefined) {
                websiteLink.textContent = "Нажаль інформація про це відсутня";
            } else {
                websiteLink.textContent = place.properties.website;
                websiteLink.href = place.properties.website;
                websiteLink.target = '_blank'; // Відкривати посилання у новому вікні
            }

            // Додаємо текст та посилання до контейнера
            placesListContainer.appendChild(OpenHours);
            placesListContainer.appendChild(OpenHoursinfo);
            placesListContainer.appendChild(detailsText);
            placesListContainer.appendChild(websiteLink);

            // Створюємо роздільник
            const divider = document.createElement('div');
            divider.classList.add('divider');
            divider.style.marginTop = '1%'; // Додаємо відступ 1%
            placesListContainer.appendChild(divider);
        });
    } else {
        console.log("Місця не знайдено");
        const noPlacesMessage1 = document.createElement('p');
        noPlacesMessage1.textContent = 'Місця не знайдено :( ';
        placesListContainer.appendChild(noPlacesMessage1);
        const noPlacesMessage2 = document.createElement('p');
        noPlacesMessage2.textContent = 'Спробуйте інші категорії!';
        placesListContainer.appendChild(noPlacesMessage2);
    }
}


async function searchPlaces(cityId, category) {
    try {
        const response = await fetch(`https://api.geoapify.com/v2/places?categories=${category}&filter=place:${cityId}&limit=20&apiKey=${placesAPIKey}`);
        const data = await response.json();
        console.log(data);
        displayPlaces(data);
    } catch (error) {
        console.log("Error fetching data from API:", error);
    }
}

async function getCityId(city) {
    try {
        const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${city}&format=json&apiKey=${geocodeAPIKey}`);
        const data = await response.json();
        console.log(data);
        
        if (data.results.length > 0) {
            const cityId = data.results[0].place_id;
            console.log("City ID:", cityId);
            const category = document.getElementById('categorySelect').value;
            searchPlaces(cityId, category);
        } else {
            console.log("City not found");
            const placesListContainer = document.getElementById('placesList');
            placesListContainer.innerHTML = 'Місто не знайдено';
        }
    } catch (error) {
        console.log("Error fetching data from API:", error);
    }
}

function createMap(place) {
    const mapContainer = document.createElement('div');
    mapContainer.setAttribute('class', 'map');
    mapContainer.style.width = '500px';
    mapContainer.style.height = '300px';

    const map = new google.maps.Map(mapContainer, {
        center: { lat: place.geometry.coordinates[1], lng: place.geometry.coordinates[0] },
        zoom: 15
    });

    new google.maps.Marker({
        position: { lat: place.geometry.coordinates[1], lng: place.geometry.coordinates[0] },
        map: map,
        title: place.properties.name
    });

    document.getElementById('placesList').appendChild(mapContainer);
}

document.getElementById('searchButton').addEventListener('click', function() {
    const city = document.getElementById('citySelect').value;
    getCityId(city);
});