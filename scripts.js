const months = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

// Создание полей ввода для каждого месяца
const monthlyInputs = document.getElementById('monthlyInputs');
months.forEach(month => {
    const label = document.createElement('label');
    label.textContent = `Введите доход за ${month}:`;
    monthlyInputs.appendChild(label);

    const input = document.createElement('input');
    input.type = 'text';
    input.id = month;
    input.placeholder = 'Введите доход';
    input.addEventListener('input', formatInput); // Добавляем обработчик для форматирования
    monthlyInputs.appendChild(input);
});

// Функция для форматирования ввода с точками
function formatInput(event) {
    const input = event.target;
    let value = input.value.replace(/\./g, ''); // Убираем все точки
    value = value.replace(/\D/g, ''); // Убираем все нецифровые символы
    if (value.length > 3) {
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Добавляем точки как разделители тысяч
    }
    input.value = value;
}

// Функция для форматирования числа с точками (для отображения)
function formatNumber(value) {
    return value ? parseInt(value).toLocaleString('ru-RU').replace(/,/g, '.') : '0';
}

// Функция для очистки форматирования (убираем точки)
function cleanNumber(value) {
    return value.replace(/\./g, '');
}

// Функция для расчета НДС
function calculateVAT() {
    const currentYearIncome = parseFloat(cleanNumber(document.getElementById('currentYearIncome').value)) || 0;
    let cumulativeIncome = 0;
    let totalVAT = 0;
    let vatRate = 0.0;

    const tableBody = document.querySelector('#resultsTable tbody');
    tableBody.innerHTML = ''; // Очистка таблицы перед расчетом

    const results = [];

    months.forEach(month => {
        const monthlyIncome = parseFloat(cleanNumber(document.getElementById(month).value)) || 0;
        cumulativeIncome += monthlyIncome;

        if (cumulativeIncome > 250000000) {
            vatRate = 0.07;
        } else if (cumulativeIncome > 60000000 && vatRate === 0) {
            vatRate = 0.05;
        }

        const vatAmount = cumulativeIncome > 60000000 ? monthlyIncome * vatRate : 0;
        totalVAT += vatAmount;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${month}</td>
            <td>${formatNumber(monthlyIncome)}</td>
            <td>${formatNumber(cumulativeIncome)}</td>
            <td>${vatRate > 0 ? `${(vatRate * 100).toFixed(2)}%` : 'без налога'}</td>
            <td>${formatNumber(vatAmount.toFixed(2))}</td>
        `;
        tableBody.appendChild(row);

        results.push([
            month,
            monthlyIncome,
            cumulativeIncome,
            vatRate > 0 ? (vatRate * 100).toFixed(2) : 0,
            vatAmount.toFixed(2)
        ]);
    });

    document.getElementById('totalLabel').textContent = `Итого: ${formatNumber(cumulativeIncome)} ₽, Сумма НДС: ${formatNumber(totalVAT.toFixed(2))} ₽`;

    // Сохранение данных в localStorage (вместо Excel)
    localStorage.setItem('vatResults', JSON.stringify(results));
    alert('Данные сохранены в локальное хранилище.');
}

// Функция для очистки таблицы
function clearTable() {
    document.querySelector('#resultsTable tbody').innerHTML = '';
    document.getElementById('totalLabel').textContent = 'Итого: 0 ₽, Сумма НДС: 0 ₽';
}

// Функция для сохранения данных в Excel
function saveToExcel() {
    const results = JSON.parse(localStorage.getItem('vatResults')) || [];
    if (results.length === 0) {
        alert('Нет данных для сохранения.');
        return;
    }

    // Создаем массив данных для Excel
    const excelData = [
        ["месяц", "Доход в месяце", "Доход нарастающим итогом", "", "Сумма НДС"]
    ];

    let cumulativeIncome = 0; // Нарастающий итог
    let totalVAT = 0; // Общая сумма НДС

    results.forEach((row) => {
        const month = row[0];
        const monthlyIncome = parseFloat(cleanNumber(row[1].toString())) || 0;
        cumulativeIncome += monthlyIncome;

        // Расчет ставки НДС
        let vatRate = 0;
        if (cumulativeIncome > 250000000) {
            vatRate = 7;
        } else if (cumulativeIncome > 60000000) {
            vatRate = 5;
        }

        // Расчет суммы НДС
        const vatAmount = cumulativeIncome > 60000000 ? monthlyIncome * (vatRate / 100) : 0;
        totalVAT += vatAmount;

        // Добавление строки в данные для Excel
        excelData.push([month, monthlyIncome, cumulativeIncome, vatRate / 100, vatAmount.toFixed(2)]);
    });

    // Добавление итоговых строк
    excelData.push(["", "", "", "НДС", totalVAT.toFixed(2)]);
    excelData.push(["", "", "", "УСН", ((cumulativeIncome - totalVAT) * 0.06).toFixed(2)]);
    excelData.push(["", "", "", "Итого налоги", (totalVAT + (cumulativeIncome - totalVAT) * 0.06).toFixed(2)]);

    // Создание рабочей книги и листа
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);

    // Форматирование ячеек для ставки НДС (столбец D)
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: 3 }); // Столбец D (индекс 3)
        if (worksheet[cellAddress]) {
            worksheet[cellAddress].z = '0%'; // Формат ячейки как процент
        }
    }

    // Добавление листа в книгу
    XLSX.utils.book_append_sheet(workbook, worksheet, "Расчет НДС");

    // Сохранение файла
    XLSX.writeFile(workbook, "vat_results.xlsx");
}