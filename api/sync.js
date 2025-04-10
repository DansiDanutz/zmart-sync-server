const baseId = process.env.AIRTABLE_BASE_ID;
const token = process.env.AIRTABLE_TOKEN;

export default async function handler(req, res) {
  const { table } = req.query;

  if (!table) {
    return res.status(400).json({ error: "Missing table name. Use ?table=users, products, etc." });
  }

  const tableEnvName = `AIRTABLE_TABLE_${table.toUpperCase()}`;
  const tableId = process.env[tableEnvName];

  if (!tableId) {
    return res.status(404).json({ error: `Table '${table}' not found.` });
  }

  const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableId}`;

  if (req.method === "GET") {
    // 📥 GET: fetch records
    try {
      const response = await fetch(airtableUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: "Error fetching data", details: err.message });
    }
  }

  else if (req.method === "POST") {
    // 📝 POST: add or update records
    const { records } = req.body;

    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ error: "Missing or invalid 'records' array in body." });
    }

    try {
      const response = await fetch(airtableUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ records })
      });

      const data = await response.json();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: "Error posting data", details: err.message });
    }
  }

  else {
    res.status(405).json({ error: "Method not allowed" });
  }
}


