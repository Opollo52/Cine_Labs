// API Route pour proxy vers TMDB
export default async function handler(req, res) {
  // Activer CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { endpoint, page = 1 } = req.query;
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key manquante' });
  }

  try {
    let url;
    switch (endpoint) {
      case 'trending':
        url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=fr-FR&page=${page}`;
        break;
      case 'movie':
        const { id } = req.query;
        url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=fr-FR&append_to_response=videos`;
        break;
      case 'credits':
        const { id: creditId } = req.query;
        url = `https://api.themoviedb.org/3/movie/${creditId}/credits?api_key=${apiKey}&language=fr-FR`;
        break;
      case 'search':
        const { query } = req.query;
        url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=fr-FR&query=${encodeURIComponent(query)}&page=${page}`;
        break;
      default:
        return res.status(400).json({ error: 'Endpoint non supporté' });
    }

    const response = await fetch(url);
    const data = await response.json();
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des données' });
  }
}