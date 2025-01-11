// Переменная для хранения API-ключа
let apiKey = localStorage.getItem('yandexMapsApiKey') || '';

// Инициализация карты
let map;

function initMap() {
    if (!apiKey) {
        showNotification('Введите API-ключ Яндекс.Карт для использования карты.');
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
    const apiKeyError = document.getElementById('apiKeyError');

    if (!apiKeyInput) {
        apiKeyError.style.display = 'block';
    } else {
        apiKeyError.style.display = 'none';
        apiKey = apiKeyInput;
        localStorage.setItem('yandexMapsApiKey', apiKey);
        showNotification('API-ключ сохранен!');
        initMap();
    }
});

// Обработчик формы поиска
document.getElementById('searchForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    if (!apiKey) {
        showNotification('Введите API-ключ Яндекс.Карт для выполнения поиска.');
        return;
    }

    const cityInput = document.getElementById('cityInput').value;
    const streetInput = document.getElementById('streetInput').value;
    const houseCountInput = document.getElementById('houseCountInput').value;
    const cityError = document.getElementById('cityError');
    const streetError = document.getElementById('streetError');
    const houseCountError = document.getElementById('houseCountError');

    let isValid = true;

    if (!cityInput) {
        cityError.style.display = 'block';
        isValid = false;
    } else {
        cityError.style.display = 'none';
    }

    if (!streetInput) {
        streetError.style.display = 'block';
        isValid = false;
    } else {
        streetError.style.display = 'none';
    }

    if (!houseCountInput || houseCountInput < 1 || houseCountInput > 300) {
        houseCountError.style.display = 'block';
        isValid = false;
    } else {
        houseCountError.style.display = 'none';
    }

    if (!isValid) {
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
        showNotification('Произошла ошибка при выполнении поиска.');
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
        showNotification(`Ошибка: ${error.message}`);
        return null;
    }
}

// Обработчик формы поиска
document.getElementById('searchForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    if (!apiKey) {
        showNotification('Введите API-ключ Яндекс.Карт для выполнения поиска.');
        return;
    }

    const cityInput = document.getElementById('cityInput').value;
    const streetInput = document.getElementById('streetInput').value;
    const houseCountInput = document.getElementById('houseCountInput').value;
    const cityError = document.getElementById('cityError');
    const streetError = document.getElementById('streetError');
    const houseCountError = document.getElementById('houseCountError');

    let isValid = true;

    if (!cityInput) {
        cityError.style.display = 'block';
        isValid = false;
    } else {
        cityError.style.display = 'none';
    }

    if (!streetInput) {
        streetError.style.display = 'block';
        isValid = false;
    } else {
        streetError.style.display = 'none';
    }

    if (!houseCountInput || houseCountInput < 1 || houseCountInput > 300) {
        houseCountError.style.display = 'block';
        isValid = false;
    } else {
        houseCountError.style.display = 'none';
    }

    if (!isValid) {
        return;
    }

    const searchButton = document.querySelector('#searchForm button');
    searchButton.disabled = true;
    searchButton.textContent = 'Поиск...';
    document.getElementById('loading').style.display = 'flex'; // Показываем значок загрузки

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
        showNotification('Произошла ошибка при выполнении поиска.');
    } finally {
        searchButton.disabled = false;
        searchButton.textContent = 'Найти';
        document.getElementById('loading').style.display = 'none'; // Скрываем значок загрузки
    }
});

// Показываем значок загрузки
document.getElementById('loading').classList.add('show');
document.getElementById('loading').style.display = 'flex';

// Скрываем значок загрузки
document.getElementById('loading').classList.remove('show');
setTimeout(() => {
    document.getElementById('loading').style.display = 'none';
}, 300); // Задержка для завершения анимации

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
    showNotification('Данные сохранены!');
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
        showNotification('Выберите хотя бы одну улицу.');
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
        showNotification('Нет данных для экспорта.');
    }
}

// Экспорт данных в CSV
function exportToCSV() {
    const savedData = localStorage.getItem('savedData');
    if (savedData) {
        const data = JSON.parse(savedData);
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Город,Улица,Адрес,Координаты\n";

        Object.keys(data).forEach(city => {
            Object.keys(data[city]).forEach(street => {
                data[city][street].forEach(house => {
                    csvContent += `${city},${street},${house.address},${house.coordinates}\n`;
                });
            });
        });

        const encodedUri = encodeURI(csvContent);
        const a = document.createElement('a');
        a.href = encodedUri;
        a.download = `saved_streets.csv`;
        a.click();
    } else {
        showNotification('Нет данных для экспорта.');
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
                showNotification('Данные успешно импортированы!');
            } catch (error) {
                showNotification('Ошибка при импорте данных. Убедитесь, что файл имеет правильный формат JSON.');
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

// Уведомления
function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, duration);
}

// Переключение темы
document.getElementById('themeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    this.textContent = isDarkTheme ? 'Светлая тема' : 'Темная тема';
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
});

// При загрузке страницы применяем сохраненную тему
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    document.getElementById('themeToggle').textContent = 'Светлая тема';
}

// Фильтрация и сортировка результатов
document.getElementById('filterInput').addEventListener('input', function() {
    filterResults(this.value);
});

document.getElementById('sortSelect').addEventListener('change', function() {
    sortResults(this.value);
});

function filterResults(query) {
    const houses = JSON.parse(localStorage.getItem('savedData') || '{}');
    const filteredHouses = [];
    Object.keys(houses).forEach(city => {
        Object.keys(houses[city]).forEach(street => {
            houses[city][street].forEach(house => {
                if (house.address.toLowerCase().includes(query.toLowerCase())) {
                    filteredHouses.push(house);
                }
            });
        });
    });
    displayResults(filteredHouses);
}

function sortResults(criteria) {
    const houses = JSON.parse(localStorage.getItem('savedData') || '{}');
    const sortedHouses = [];
    Object.keys(houses).forEach(city => {
        Object.keys(houses[city]).forEach(street => {
            sortedHouses.push(...houses[city][street]);
        });
    });

    if (criteria === 'address') {
        sortedHouses.sort((a, b) => a.address.localeCompare(b.address));
    } else if (criteria === 'coordinates') {
        sortedHouses.sort((a, b) => a.coordinates.localeCompare(b.coordinates));
    }

    displayResults(sortedHouses);
}

// Инициализация карты при загрузке страницы
if (apiKey) {
    initMap();
}

function addToHistory(fullAddress) {
    searchHistory.push(fullAddress);
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = `<strong>История поиска:</strong> ${searchHistory.join(', ')} <button id="clearHistory">Очистить историю</button>`;

    document.getElementById('clearHistory').addEventListener('click', function() {
        searchHistory = [];
        historyDiv.innerHTML = '<strong>История поиска:</strong>';
    });
}

// Обработчики кнопок
document.getElementById('exportButton').addEventListener('click', exportData);
document.getElementById('exportCSVButton').addEventListener('click', exportToCSV);
document.getElementById('loadButton').addEventListener('click', loadSelectedData);

// Обновляем список улиц при загрузке страницы
updateStreetList();