document.addEventListener('DOMContentLoaded', function () {
    const clusterSelect = document.getElementById('clusterSelect');
    const geneList = document.getElementById('geneList');
    const geneSearch = document.getElementById('geneSearch');
    const searchButton = document.getElementById('searchButton');

    let data = [];

    Papa.parse('clusterization.csv', {
        download: true,
        header: true,
        complete: function (results) {
            data = results.data;

            // Получаем уникальные кластеры
            const clusters = [...new Set(data.map(item => item.cluster))].sort((a, b) => a - b);

            // Заполняем выпадающий список кластерами
            clusters.forEach(cluster => {
                const option = document.createElement('option');
                option.value = cluster;
                option.textContent = `Cluster ${cluster}`;
                clusterSelect.appendChild(option);
            });

            // Обновляем список генов при выборе кластера
            clusterSelect.addEventListener('change', function () {
                const selectedCluster = clusterSelect.value;
                updateGeneList(selectedCluster);
            });

            // Триггерим событие изменения для начальной загрузки списка генов
            clusterSelect.dispatchEvent(new Event('change'));
        }
    });

    // Функция для обновления списка генов
    function updateGeneList(cluster) {
        const genes = data.filter(item => item.cluster === cluster).map(item => item.okved);
        
        // Очищаем предыдущий список генов
        geneList.innerHTML = '';

        // Заполняем список генов
        genes.forEach(gene => {
            const geneItem = document.createElement('div');
            geneItem.className = 'gene-item';
            geneItem.textContent = gene;
            geneList.appendChild(geneItem);
        });
    }

    // Функция для поиска гена
    function searchGene() {
        const searchValue = geneSearch.value.trim().toUpperCase();
        if (searchValue) {
            const gene = data.find(item => item.okved.toUpperCase() === searchValue);
            if (gene) {
                clusterSelect.value = gene.cluster;
                updateGeneList(gene.cluster);
            } else {
                alert('Gene not found');
            }
        }
    }

    // Добавляем функционал поиска по кнопке
    searchButton.addEventListener('click', searchGene);

    // Добавляем функционал поиска по клавише Enter
    geneSearch.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            searchGene();
        }
    });

    // Добавляем автоматический перевод в верхний регистр при вводе текста
    geneSearch.addEventListener('input', function () {
        geneSearch.value = geneSearch.value.toUpperCase();
    });
});
