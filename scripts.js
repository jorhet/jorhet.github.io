// Function to read CSV file
function readCSVFile(file, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const csv = event.target.result;
        const data = csv.split('\n').map(row => row.split(','));
        callback(data);
    };
    reader.readAsText(file);
}

// Function to populate cluster selector dropdown
function populateClusterSelector(clusters) {
    const clusterSelect = document.getElementById('cluster-select');
    clusters.forEach((cluster, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = `Cluster ${index + 1}`;
        clusterSelect.appendChild(option);
    });
}

// Function to display gene list for selected cluster
function displayGeneList(clusterId, clusters) {
    const geneListContainer = document.getElementById('gene-list');
    const genes = clusters[clusterId - 1];
    if (genes) {
        geneListContainer.innerHTML = '<h3>Genes in Selected Cluster:</h3>';
        const ul = document.createElement('ul');
        genes.forEach(gene => {
            const li = document.createElement('li');
            li.textContent = gene;
            ul.appendChild(li);
        });
        geneListContainer.appendChild(ul);
    } else {
        geneListContainer.innerHTML = '<p>No genes found for selected cluster.</p>';
    }
}

// Event listener for cluster selector change
document.getElementById('cluster-select').addEventListener('change', function() {
    const selectedClusterId = parseInt(this.value);
    displayGeneList(selectedClusterId, clusters);
});

// Event listener for file input change
document.getElementById('file-input').addEventListener('change', function() {
    const file = this.files[0];
    readCSVFile(file, function(data) {
        clusters = [];
        for (let i = 0; i < 80; i++) {
            clusters.push([]);
        }
        data.forEach(row => {
            const gene = row[0];
            const clusterId = parseInt(row[1]);
            clusters[clusterId - 1].push(gene);
        });
        populateClusterSelector(clusters);
    });
});
