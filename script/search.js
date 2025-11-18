// Configuration pour l'environnement
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

let apiKey;

// Fonction pour initialiser la clé API en développement local
async function initializeApiKey() {
    if (isDevelopment) {
        try {
            // Pour le développement local, importer depuis env.js
            const { API_KEY } = await import('../env.js');
            apiKey = API_KEY;
            console.log('Clé API chargée pour le développement local');
        } catch (error) {
            console.error('Fichier env.js non trouvé pour le développement local:', error);
        }
    }
}

let currentPage = 1;

async function fetchMovies(page) {
    try {
        let url;
        if (isDevelopment && apiKey) {
            url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=fr-FR&page=${page}`;
        } else {
            url = `/api/movies?endpoint=trending&page=${page}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Erreur lors du chargement des films:', error);
        return [];
    }
}

async function searchMovies(query, page = 1) {
    try {
        let url;
        if (isDevelopment && apiKey) {
            url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=fr-FR&query=${encodeURIComponent(query)}&page=${page}`;
        } else {
            url = `/api/movies?endpoint=search&query=${encodeURIComponent(query)}&page=${page}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        return [];
    }
}

const searchInput = document.getElementById('search-input');

// Initialiser l'API au chargement
document.addEventListener('DOMContentLoaded', async () => {
    await initializeApiKey();
    // Charger les films populaires par défaut
    await loadMovies();
});

searchInput.addEventListener('input', handleSearch);

async function handleSearch(event) {
    const searchTerm = event.target.value.trim();
    if (!searchTerm) {
        clearMovies();
        return;
    }

    try {
        const results = await searchMovies(searchTerm);

        if (results.length === 0) {
            const error = new Error('Aucun résultat trouvé');
            throw error;
        }

        const movieContainer = document.getElementById('movie-container');
        movieContainer.innerHTML = '';

        
        results.slice(0, 6).forEach(movie => {
            const movieElement = createMovieElement(movie);
            movieContainer.appendChild(movieElement);
        });

    } catch (error) {
        console.error(`Erreur lors de la récupération des données : ${error}`);

        const movieContainer = document.getElementById('movie-container');
        movieContainer.innerHTML = `<p>${error.message}</p>`;
    }
}

function createMovieElement(movie) {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie-item');
    movieElement.dataset.movieId = movie.id;

    const img = document.createElement('img');
    img.src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : "assets/img/No_Image_Available.jpg";
    img.alt = `Affiche de ${movie.title}`;
    img.style.width = "300px";

    img.onerror = function () {
        this.onerror = null; 
        this.src = "assets/img/No_Image_Available.jpg";
    };

    movieElement.appendChild(img);

    const title = document.createElement('h3');
    title.textContent = movie.title;
    movieElement.appendChild(title);

    const bouton = document.createElement('button');
    bouton.classList.add('more-info');
    movieElement.appendChild(bouton)
    bouton.textContent = 'En savoir plus'
    
    return movieElement;
}

function clearMovies() {
    const movieContainer = document.getElementById('movie-container');
    movieContainer.innerHTML = ''; 
}

document.addEventListener('click', function(event) {
    if (event.target.closest('.movie-item')) {
        const movieId = event.target.closest('.movie-item').dataset.movieId;
        window.location.href = `movie.html?id=${movieId}`;
    }
});


async function loadMovies() {
    const movies = await fetchMovies(currentPage);
    displayMovies(movies.slice(0, 6)); 
}

async function loadMoreMovies() {
    currentPage++;
    const movies = await fetchMovies(currentPage);
    displayMovies(movies);
}

const movieArea = document.getElementById('loader');
const buttonSection = document.createElement('section');
buttonSection.classList.add('bouton');

const loadMoreButton = document.createElement('button');
loadMoreButton.textContent = 'Charger plus';
loadMoreButton.classList.add('btn');
loadMoreButton.addEventListener('click', loadMoreMovies);

buttonSection.appendChild(loadMoreButton);
movieArea.appendChild(buttonSection);


loadMovies();


function displayMovies(movies) {
    const movieContainer = document.getElementById('movie-container');
    movies.slice(0, 18).forEach(movie => {
        
        const movieElement = createMovieElement(movie);
        movieContainer.appendChild(movieElement);
    });
}
