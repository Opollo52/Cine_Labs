import { API_KEY } from '../env.js';
const apiKey = API_KEY;


const apiBaseUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=fr-FR`;

const apiUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=fr-FR`;

let currentPage = 1;

async function fetchMovies(page) {
    try {
        const response = await fetch(`${apiUrl}&page=${page}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Erreur lors du chargement des films:', error);
    }
}

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', handleSearch);

async function handleSearch(event) {
    const searchTerm = event.target.value.trim();
    if (!searchTerm) {
        clearMovies();
        return;
    }

    const searchUrl = `${apiBaseUrl}&query=${encodeURIComponent(searchTerm)}`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (!response.ok || data.results.length === 0) {
            const error = new Error(`Erreur HTTP : ${response.status}`);
            error.data = data;
            throw error;
        }

        const movieContainer = document.getElementById('movie-container');
        movieContainer.innerHTML = '';

        
        data.results.slice(0, 6).forEach(movie => {
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


/*---------------------BOUTON CHARGER PLUS DE RESULTAT---------------------------------*/

async function loadMovies() {
    const movies = await fetchMovies(currentPage);
    displayMovies(movies.slice(0, 6)); 
}

async function loadMoreMovies() {
    currentPage++;
    const movies = await fetchMovies(currentPage);
    displayMovies(movies);
}

const buttonSection = document.createElement('section');
buttonSection.classList.add('bouton');

const loadMoreButton = document.createElement('button');
loadMoreButton.textContent = 'Charger plus';
loadMoreButton.classList.add('btn');
loadMoreButton.addEventListener('click', loadMoreMovies);

buttonSection.appendChild(loadMoreButton);
document.body.appendChild(buttonSection);

loadMovies();


function displayMovies(movies) {
    const movieContainer = document.getElementById('movie-container');
    movies.slice(0, 18).forEach(movie => {
        
        const movieElement = createMovieElement(movie);
        movieContainer.appendChild(movieElement);
        
    });
}




