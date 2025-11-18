// API Route pour proxy vers TMDB
export default async function handler(req, res) {
  // Activer CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Log pour diagnostiquer
  console.log('API Call:', req.query);

  const { endpoint, page = 1 } = req.query;
  const apiKey = process.env.TMDB_API_KEY;

  console.log('API Key présente:', !!apiKey);

  if (!apiKey) {
    console.error('API Key manquante');
    return res.status(500).json({ error: 'API Key manquante', debug: 'TMDB_API_KEY non trouvée' });
  }

  try {
    let url;
    const movieId = req.query.id;
    const searchQuery = req.query.query;
    
    switch (endpoint) {
      case 'trending':
        url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=fr-FR&page=${page}`;
        break;
      case 'movie':
        if (!movieId) {
          return res.status(400).json({ error: 'ID du film manquant' });
        }
        url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=fr-FR&append_to_response=videos`;
        break;
      case 'credits':
        if (!movieId) {
          return res.status(400).json({ error: 'ID du film manquant pour les crédits' });
        }
        url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=fr-FR`;
        break;
      case 'search':
        if (!searchQuery) {
          return res.status(400).json({ error: 'Terme de recherche manquant' });
        }
        url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=fr-FR&query=${encodeURIComponent(searchQuery)}&page=${page}`;
        break;
      default:
        return res.status(400).json({ error: 'Endpoint non supporté' });
    }

    console.log('URL TMDB:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Statut TMDB:', response.status);
    console.log('Données reçues:', data.results ? `${data.results.length} résultats` : 'Pas de résultats');
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Erreur API:', error.message);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des données',
      debug: error.message 
    });
  }
}