let currentPage = 1;

window.onload = function() {
    if (!sessionStorage.getItem('githubToken')) {
        const token = prompt("🤐Please enter your GitHub access token,The token is stored temporarily🙈 and securely in your browser while the website is open and automatically deleted when you close🙊 it.");
        // Adding validation for token format
        if (token && validateToken(token)) {
            sessionStorage.setItem('githubToken', token);
        } else {
            alert('Invalid token format. Please ensure your token is correct and try again.Please refresh the page and enter your GitHub token');
            console.log('Invalid or no token provided, please refresh and provide a valid token.');
        }
    }
    addEventListeners();
}

function validateToken(token) {
    // Simple regex to check if token is alphanumeric and of correct length
    return /^[a-zA-Z0-9_]{35,40}$/.test(token);
}

function addEventListeners() {
    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault();
        currentPage = 1;
        performSearch();
    });
    document.getElementById('nextPage').addEventListener('click', function(event) {
        currentPage++;
        performSearch();
    });
}

function performSearch() {
    const query = document.getElementById('searchQuery').value;
    const token = sessionStorage.getItem('githubToken');
    if (token) {
        fetchGitHub(query, token);
    } else {
        alert("GitHub token is not set. Please refresh the page and enter your GitHub token.");
    }
}

function fetchGitHub(query, token) {
    fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&page=${currentPage}&per_page=10`, {
        headers: { 'Authorization': `${token}` }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch data: ' + response.statusText);
            }
        })
        .then(data => updateResults(data.items, 'GitHub'))
        .catch(error => {
            console.error('GitHub Error:', error);
            alert('Error: ' + error.message);
        });
}

function updateResults(items, source) {
    const resultsContainer = document.getElementById('results');
    if (currentPage === 1) resultsContainer.innerHTML = '';
    items.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.textContent = `${source}: ${item.html_url}`;
        resultsContainer.appendChild(resultItem);
    });
}
