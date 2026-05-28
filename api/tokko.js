export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { endpoint, key } = req.query;
  if (!endpoint || !key) return res.status(400).json({ error: 'Faltan parámetros' });
  const allowed = ['contact', 'property', 'operation'];
  if (!allowed.includes(endpoint)) return res.status(400).json({ error: 'Endpoint no permitido' });
  try {
    const url = `https://www.tokkobroker.com/api/v1/${endpoint}/?key=${key}&format=json&limit=100`;
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}

