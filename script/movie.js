import { API_KEY } from '../env.js';
const apiKey = API_KEY;

const apiBaseUrl = 'https://api.themoviedb.org/3/movie';


document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    console.log('Movie ID:', movieId);

    if (!movieId) {
        displayError('Identifiant du film introuvable.');
        return;
    }

    const movieUrl = `${apiBaseUrl}/${movieId}?api_key=${apiKey}&language=fr-FR&append_to_response=videos`;
    console.log('API URL:', movieUrl);

    try {
        const response = await fetch(movieUrl);
        const movie = await response.json();
        console.log('Movie Data:', movie);

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const creditsUrl = `${apiBaseUrl}/${movieId}/credits?api_key=${apiKey}&language=fr-FR`;
        const creditsResponse = await fetch(creditsUrl);
        const credits = await creditsResponse.json();
        console.log('Credits Data:', credits);

        if (!creditsResponse.ok) {
            throw new Error(`Erreur HTTP (Credits) : ${creditsResponse.status}`);
        }

        displayMovieDetails(movie, credits.cast);
    } catch (error) {
        console.error('Erreur lors de la récupération des détails :', error);
        displayError('Impossible de charger les détails du film.');
    }
});

function displayMovieDetails(movie, cast) {
    console.log('Displaying movie details:', movie);

    const movieContainer = document.getElementById('movie-details');
    movieContainer.innerHTML = '';

    const videoContainer = document.getElementById('fond');
    videoContainer.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${movie.backdrop_path}')`;

    
    const leftContainer = document.createElement('div');
    leftContainer.className = 'left-container';
    displayPoster(movie, leftContainer);

    
    const rightContainer = document.createElement('div');
    rightContainer.className = 'right-container';

    // Titre
    const title = document.createElement('h1');
    title.className = 'titre'
    title.textContent = movie.title;
    rightContainer.appendChild(title);


    // Date de sortie
    const releaseDateLabel = document.createElement('span');
    releaseDateLabel.className = 'category-label';

    const releaseDate = document.createElement('p');
    releaseDate.className = 'date';
    releaseDate.appendChild(releaseDateLabel);

    if (movie.release_date) {
        const releaseDateFormatted = new Date(movie.release_date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        releaseDate.appendChild(document.createTextNode(releaseDateFormatted));
    } else {
        releaseDate.appendChild(document.createTextNode('Non disponible.'));
    }
    rightContainer.appendChild(releaseDate);



    // Genres
    const genreLabel = document.createElement('span');
    genreLabel.className = 'category-label';
    genreLabel.textContent = 'Genres : ';

    const genres = document.createElement('p');
    genres.className = 'genres';
    genres.appendChild(genreLabel);
    genres.appendChild(
        document.createTextNode(
            movie.genres.map(genre => genre.name).join(', ') || 'Non disponible.'
        )
    );
    rightContainer.appendChild(genres);

    // Note
        const ratingLabel = document.createElement('span');
    ratingLabel.className = 'category-label';

    const rating = document.createElement('p');
    rating.className = 'note';

    // Ajouter l'étoile
    const starIcon = document.createElement('span');
    starIcon.className = 'etoile';
    starIcon.textContent = '⭐';

    // Construire l'affichage de la note
    rating.appendChild(ratingLabel);
    rating.appendChild(starIcon);
    rating.appendChild(document.createTextNode(` ${movie.vote_average || 'Non noté'} / 10`));

    
    rightContainer.appendChild(rating);


    // Description
    const plotLabel = document.createElement('span');
    plotLabel.className = 'category-label';

    const plot = document.createElement('p');
    plot.className = 'description';
    plot.appendChild(plotLabel);
    plot.appendChild(document.createTextNode(movie.overview || 'Résumé non disponible.'));
    rightContainer.appendChild(plot);


    // Acteurs
    const actorsLabel = document.createElement('span');
    actorsLabel.className = 'category-label';
    actorsLabel.textContent = 'Acteurs principaux : ';

    const actors = document.createElement('p');
    actors.className = 'acteurs';
    actors.appendChild(actorsLabel);
    actors.appendChild(
        document.createTextNode(
            cast
                .slice(0, 5)
                .map(actor => actor.name)
                .join(', ') || 'Non disponible.'
        )
    );
    rightContainer.appendChild(actors);




    if (movie.videos && movie.videos.results && movie.videos.results.some(video => video.type === 'Trailer' || video.type === 'Teaser')) {
        const teaserButton = document.createElement('button');
        teaserButton.className = 'viewTrailer';
        teaserButton.textContent = "Voir la bande d'annonce";
        teaserButton.addEventListener('click', async function() {
            const trailer = movie.videos.results.find(video => video.type === 'Trailer' || video.type === 'Teaser');
            if (trailer) {
                const videoContainer = document.getElementById('teaser-container');
                videoContainer.innerHTML = ''; 
                const teaser = document.createElement('iframe');
                teaser.src = `https://www.youtube.com/embed/${trailer.key}`;
                teaser.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                videoContainer.appendChild(teaser);
            }
        });
        rightContainer.appendChild(teaserButton);
    }


    movieContainer.appendChild(leftContainer);
    movieContainer.appendChild(rightContainer);
}


function displayPoster(movie, container) {
    const img = document.createElement('img');
    img.src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'assets/img/No_Image_Available.jpg';
    img.alt = `Affiche de ${movie.title}`;
    img.classList.add('poster'); 
    container.appendChild(img);
}

function displayError(message) {
    console.log('Displaying error:', message);

    const movieContainer = document.getElementById('movie-details');
    movieContainer.innerHTML = `<p class="error">${message}</p>`;
}

