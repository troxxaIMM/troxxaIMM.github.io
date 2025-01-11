// Переменная для хранения API-ключа
let apiKey = localStorage.getItem('yandexMapsApiKey') || '';

// Инициализация карты
let map;

function initMap() {
    if (!apiKey) {
        alert('Введите API-ключ Яндекс.Карт для использования карты.');
        return;
    }

    // Динамически загружаем API Яндекс.Карт с введенным ключом
    const script = document.createElement('script');
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
    script.onload = () => {
        ymaps.ready(() => {
            map = new ymaps.Map('map', {
                center: [61.254035, 73.396602], // Центр карты (Сургут)
                zoom: 10
            });
        });
    };
    document.head.appendChild(script);
}

// Обработчик для сохранения API-ключа
document.getElementById('saveApiKeyButton').addEventListener('click', function() {
    const apiKeyInput = document.getElementById('apiKeyInput').value;
    if (apiKeyInput) {
        apiKey = apiKeyInput;
        localStorage.setItem('yandexMapsApiKey', apiKey);
        alert('API-ключ сохранен!');
        initMap(); // Переинициализируем карту с новым ключом
    } else {
        alert('Введите API-ключ.');
    }
});

// Обработчик формы поиска
document.getElementById('searchForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    if (!apiKey) {
        alert('Введите API-ключ Яндекс.Карт для выполнения поиска.');
        return;
    }

    const searchButton = document.querySelector('#searchForm button');
    searchButton.disabled = true;
    searchButton.textContent = 'Поиск...';
    document.getElementById('loading').style.display = 'block';

    try {
        const cityName = document.getElementById('cityInput').value;
        const streetName = document.getElementById('streetInput').value;
        const houseCount = parseInt(document.getElementById('houseCountInput').value, 10);
        const fullAddress = `${cityName}, ${streetName}`;
        addToHistory(fullAddress);

        document.getElementById('results').innerHTML = '';
        map.geoObjects.removeAll();

        const houses = [];
        for (let i = 1; i <= houseCount; i++) {
            const address = `${cityName}, ${streetName}, ${i}`;
            const coordinates = await getCoordinates(address);
            if (coordinates) {
                houses.push({ address: address, coordinates: coordinates });
            }
            await new Promise(resolve => setTimeout(resolve, 200)); // Задержка между запросами
        }
        displayResults(houses);
        saveDataToLocalStorage(cityName, streetName, houses);
        updateStreetList();
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при выполнении поиска.');
    } finally {
        searchButton.disabled = false;
        searchButton.textContent = 'Найти';
        document.getElementById('loading').style.display = 'none';
    }
});

// Получение координат через API Яндекс.Геокодера
async function getCoordinates(address) {
    const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${encodeURIComponent(address)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Ошибка сети');
        }
        const data = await response.json();
        const feature = data.response.GeoObjectCollection.featureMember[0];
        if (feature) {
            const coordinates = feature.GeoObject.Point.pos.split(' ').reverse().join(', ');
            return coordinates;
        } else {
            throw new Error('Адрес не найден');
        }
    } catch (error) {
        console.error('Ошибка при запросе к API:', error);
        alert(`Ошибка: ${error.message}`);
        return null;
    }
}

// Отображение результатов
function displayResults(houses) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (houses.length === 0) {
        resultsDiv.innerHTML = '<p>Дома на этой улице не найдены.</p>';
        return;
    }

    houses.forEach(house => {
        const houseDiv = document.createElement('div');
        houseDiv.className = 'result-item';
        houseDiv.innerHTML = `
            <strong>Адрес:</strong> ${house.address}<br>
            <strong>Координаты:</strong> ${house.coordinates}
        `;
        resultsDiv.appendChild(houseDiv);

        // Добавление метки на карту
        const coordinates = house.coordinates.split(', ').map(Number);
        const placemark = new ymaps.Placemark(coordinates, {
            hintContent: house.address,
            balloonContent: `Адрес: ${house.address}, Координаты: ${house.coordinates}`
        });
        map.geoObjects.add(placemark);
    });

    // Центрирование карты на первом доме
    if (houses.length > 0) {
        const firstHouseCoords = houses[0].coordinates.split(', ').map(Number);
        map.setCenter(firstHouseCoords, 15);
    }
}

// Сохранение данных в localStorage
function saveDataToLocalStorage(cityName, streetName, houses) {
    const savedData = JSON.parse(localStorage.getItem('savedData') || '{}');

    if (!savedData[cityName]) {
        savedData[cityName] = {};
    }
    if (!savedData[cityName][streetName]) {
        savedData[cityName][streetName] = [];
    }
    savedData[cityName][streetName] = houses;

    localStorage.setItem('savedData', JSON.stringify(savedData));
    alert('Данные сохранены!');
}

// Обновление списка улиц
function updateStreetList() {
    const savedData = JSON.parse(localStorage.getItem('savedData') || '{}');
    const streetList = document.getElementById('streetList');
    streetList.innerHTML = '';

    Object.keys(savedData).forEach(city => {
        const cityItem = document.createElement('div');
        cityItem.className = 'city-item';
        cityItem.textContent = city;
        streetList.appendChild(cityItem);

        Object.keys(savedData[city]).forEach(street => {
            const streetItem = document.createElement('div');
            streetItem.className = 'street-item';
            streetItem.innerHTML = `
                <label>
                    <input type="checkbox" value="${city}:${street}"> ${street}
                </label>
            `;
            streetList.appendChild(streetItem);
        });
    });
}

// Загрузка выбранных данных
function loadSelectedData() {
    const savedData = JSON.parse(localStorage.getItem('savedData') || '{}');
    const selectedStreets = Array.from(document.querySelectorAll('#streetList input:checked')).map(input => input.value.split(':'));

    document.getElementById('results').innerHTML = '';
    map.geoObjects.removeAll();

    selectedStreets.forEach(([city, street]) => {
        const houses = savedData[city][street];
        if (houses) {
            displayResults(houses);
        }
    });

    if (selectedStreets.length === 0) {
        alert('Выберите хотя бы одну улицу.');
    }
}

// Экспорт данных в JSON
function exportData() {
    const savedData = localStorage.getItem('savedData');
    if (savedData) {
        const data = JSON.parse(savedData);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `saved_streets.json`;
        a.click();
        URL.revokeObjectURL(url);
    } else {
        alert('Нет данных для экспорта.');
    }
}

// Обработчик кнопки импорта данных
document.getElementById('importButton').addEventListener('click', function() {
    document.getElementById('importFileInput').click();
});

// Обработчик выбора файла
document.getElementById('importFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                localStorage.setItem('savedData', JSON.stringify(importedData));
                updateStreetList();
                alert('Данные успешно импортированы!');
            } catch (error) {
                alert('Ошибка при импорте данных. Убедитесь, что файл имеет правильный формат JSON.');
            }
        };
        reader.readAsText(file);
    }
});

// История поиска
let searchHistory = [];

function addToHistory(fullAddress) {
    searchHistory.push(fullAddress);
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = `<strong>История поиска:</strong> ${searchHistory.join(', ')}`;
}

// Инициализация карты после загрузки API
ymaps.ready(initMap);

// Обработчики кнопок
document.getElementById('exportButton').addEventListener('click', exportData);
document.getElementById('loadButton').addEventListener('click', loadSelectedData);

// Обновляем список улиц при загрузке страницы
updateStreetList();

// Инициализация карты при загрузке страницы
if (apiKey) {
    initMap();
}
