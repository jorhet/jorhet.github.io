javascript
document.addEventListener('DOMContentLoaded', function () {
    const clusterSelect = document.getElementById('clusterSelect');
    const geneList = document.getElementById('geneList');

    Papa.parse('clusterization.csv', {
        download: true,
        header: true,
        complete: function (results) {
            const data = results.data;

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
                const genes = data.filter(item => item.cluster === selectedCluster).map(item => item.okved);
                
                // Очищаем предыдущий список генов
                geneList.innerHTML = '';

                // Заполняем список генов
                genes.forEach(gene => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';
                    listItem.textContent = gene;
                    geneList.appendChild(listItem);
                });
            });

            // Триггерим событие изменения для начальной загрузки списка генов
            clusterSelect.dispatchEvent(new Event('change'));
        }
    });
});
