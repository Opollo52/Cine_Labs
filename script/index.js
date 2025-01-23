import { API_KEY } from '../env.js';
const apiKey = API_KEY;

const apiUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=fr-FR`;
let currentPage = 1;


const movieArea = document.getElementById('movies');
const movieContainer = document.createElement('section');
movieContainer.id = 'movie-container';
movieArea.appendChild(movieContainer);

async function fetchMovies(page) {
    const url = new URL(apiUrl);
    url.searchParams.set('page', page);

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Erreur lors du chargement des films:', error);
    }
}

function displayMovies(movies) {
    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');

        const movieSummary = movie.overview.length > 150 ? `${movie.overview.slice(0, 150)}...` : movie.overview;

        movieElement.innerHTML = `
            <a href="movie.html?id=${movie.id}">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>${movieSummary}</p>
                <button class="more-info">En savoir plus</button>
            </a>    
        `;

        movieContainer.appendChild(movieElement);
    });
}

async function loadMovies() {
    const movies = await fetchMovies(currentPage);
    displayMovies(movies.slice(0, 6)); 
}

async function loadMoreMovies() {
    currentPage++;
    const movies = await fetchMovies(currentPage);
    displayMovies(movies);
}

const video = document.getElementById('teaser-video');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      video.play();
    } else {
      video.pause(); 
    }
  });
}, { threshold: 0.5 });

observer.observe(video);

const muteButton = document.getElementById('checkboxInput');
muteButton.addEventListener('click', () => {
    if (muteButton.checked) {
        video.muted = true;
    } else {
        video.muted = false;
    }
});

const buttonSection = document.createElement('section');
buttonSection.classList.add('bouton');

const loadMoreButton = document.createElement('button');
loadMoreButton.textContent = 'Charger plus';
loadMoreButton.classList.add('btn');
loadMoreButton.addEventListener('click', loadMoreMovies);

buttonSection.appendChild(loadMoreButton);
movieArea.appendChild(buttonSection);

loadMovies();

