// API Route pour proxy vers TMDB - Version CommonJS pour Vercel
module.exports = function handler(req, res) {
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
    return res.status(500).json({ error: 'API Key manquante', debug: 'TMDB_API_KEY non trouvée' });
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
  
  // Utiliser le module https natif de Node.js
  const https = require('https');
  const url = require('url');
  
  const parsedUrl = url.parse(tmdbUrl);
  
  const options = {
    hostname: parsedUrl.hostname,
    port: 443,
    path: parsedUrl.path,
    method: 'GET'
  };

  const request = https.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log('Statut TMDB: OK');
        console.log('Données reçues:', jsonData.results ? `${jsonData.results.length} résultats` : 'Pas de résultats');
        res.status(200).json(jsonData);
      } catch (error) {
        console.error('Erreur parsing JSON:', error.message);
        res.status(500).json({ 
          error: 'Erreur parsing réponse TMDB',
          debug: error.message 
        });
      }
    });
  });

  request.on('error', (error) => {
    console.error('Erreur requête HTTPS:', error.message);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des données',
      debug: error.message 
    });
  });

  request.end();
};