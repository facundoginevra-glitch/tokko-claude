export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { endpoint, key } = req.query;
  if (!endpoint || !key) return res.status(400).json({ error: 'Faltan parametros' });
  const allowed = ['contact', 'property', 'operation', 'operations', 'webcontact', 'signed_operations'];
  if (!allowed.includes(endpoint)) return res.status(400).json({ error: 'Endpoint no permitido' });
  try {
    const baseUrl = `https://www.tokkobroker.com/api/v1/${endpoint}/?key=${key}&format=json&limit=20`;
    const url = endpoint === 'webcontact'
      ? `${baseUrl}&ordering=-created_date`
      : `${baseUrl}&ordering=-created_at`;
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const fetchOpts = endpoint === 'webcontact'
      ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ created_date__gte: firstDay }) }
      : { method: 'GET' };
    const response = await fetch(url, fetchOpts);
    const data = await response.json();
    return res.status(200).json(data);
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
