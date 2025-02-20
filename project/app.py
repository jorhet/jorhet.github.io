from flask import Flask, request, render_template, send_file
from bs4 import BeautifulSoup
import pandas as pd
import io

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Получаем HTML-разметку из текстового поля
        html_content = request.form['html_content']

        # Парсим HTML с помощью BeautifulSoup
        soup = BeautifulSoup(html_content, 'html.parser')

        # Находим все ячейки с col-id="query"
        query_cells = soup.find_all('div', attrs={'col-id': 'query'})

        # Извлекаем текстовые значения из этих ячеек
        key_queries = []
        for cell in query_cells:
            query = cell.find('span', class_='ag-cell-value')
            if query:
                key_queries.append(query.text.strip())

        # Находим все ячейки с col-id="wb_frequencies_month"
        query_cells = soup.find_all('div', attrs={'col-id': 'wb_frequencies_month'})

        # Извлекаем текстовые значения из этих ячеек
        freq_queries = []
        for cell in query_cells:
            query = cell.find('span', class_='ag-cell-value')
            if query:
                freq_queries.append(query.text.strip().replace(' ', ""))

        # Находим все ячейки с aria-colindex="6"
        cells_with_colindex_6 = soup.find_all('div', attrs={'aria-colindex': '6'})

        # Извлекаем пары чисел или одиночные числа
        pairs = []
        for cell in cells_with_colindex_6:
            boost_container = cell.find('span', class_='marketpapa-boost-info-container')
            if boost_container:
                numbers = boost_container.find_all('span')
                if len(numbers) >= 3:
                    second_number = numbers[2].text.strip()
                    pairs.append(second_number)
                else:
                    pairs.append('-')
            else:
                single_number_span = cell.find('span', attrs={'data-tip': True})
                if single_number_span:
                    single_number = single_number_span.text.strip().split()[0]
                    pairs.append(single_number)
                else:
                    pairs.append('-')

        pairs = pairs[1:]

        # Создаем DataFrame и сохраняем его в Excel
        df = pd.DataFrame({'key': key_queries, 'freq': freq_queries, 'pos': pairs})
        excel_file = io.BytesIO()
        df.to_excel(excel_file, index=False)
        excel_file.seek(0)

        # Отправляем файл пользователю
        return send_file(
            excel_file,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name='123.xlsx'
        )

    # Если метод GET, просто отображаем форму
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
