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

// Остальные функции (displayResults, saveDataToLocalStorage, updateStreetList, loadSelectedData, exportData, addToHistory) остаются без изменений
// ...

// Инициализация карты при загрузке страницы
if (apiKey) {
    initMap();
}