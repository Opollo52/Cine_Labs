// API Route pour proxy vers TMDB - Version ES6 pour Vercel
export default async function handler(req, res) {
  // Activer CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Méthode non autorisée' });
    return;
  }

  // Log pour diagnostiquer
  console.log('API Call:', req.query);

  const { endpoint, page = 1, id, query: searchQuery } = req.query;
  const apiKey = process.env.TMDB_API_KEY;

  console.log('API Key présente:', !!apiKey);

  if (!apiKey) {
    console.error('API Key manquante');
    return res.status(500).json({ 
      error: 'API Key manquante', 
      debug: 'TMDB_API_KEY non trouvée',
      env: Object.keys(process.env).filter(key => key.includes('TMDB')).join(', ') 
    });
  }

  // Construire l'URL TMDB
  let tmdbUrl;
  
  switch (endpoint) {
    case 'trending':
      tmdbUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=fr-FR&page=${page}`;
      break;
    case 'movie':
      if (!id) {
        return res.status(400).json({ error: 'ID du film manquant' });
      }
      tmdbUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=fr-FR&append_to_response=videos`;
      break;
    case 'credits':
      if (!id) {
        return res.status(400).json({ error: 'ID du film manquant pour les crédits' });
      }
      tmdbUrl = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=fr-FR`;
      break;
    case 'search':
      if (!searchQuery) {
        return res.status(400).json({ error: 'Terme de recherche manquant' });
      }
      tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=fr-FR&query=${encodeURIComponent(searchQuery)}&page=${page}`;
      break;
    default:
      return res.status(400).json({ error: 'Endpoint non supporté' });
  }

  console.log('URL TMDB:', tmdbUrl);
  
  try {
    // Utiliser fetch moderne
    const response = await fetch(tmdbUrl);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.status} - ${data.status_message || 'Erreur inconnue'}`);
    }
    
    console.log('Statut TMDB: OK');
    console.log('Données reçues:', data.results ? `${data.results.length} résultats` : 'Pas de résultats');
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Erreur API:', error.message);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des données',
      debug: error.message,
      url: tmdbUrl.replace(apiKey, 'API_KEY_MASQUEE')
    });
  }
}