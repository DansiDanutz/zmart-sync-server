const baseId = process.env.AIRTABLE_BASE_ID;
const token = process.env.AIRTABLE_TOKEN;

export default async function handler(req, res) {
  const { table } = req.query;

  if (!table) {
    return res.status(400).json({ error: "Missing table name. Use ?table=TABLE_NAME" });
  }

  const tableEnvName = `AIRTABLE_TABLE_${table.toUpperCase()}`;
  const tableId = process.env[tableEnvName];

  if (!tableId) {
    return res.status(404).json({ error: `Table '${table}' not found.` });
  }

  const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableId}`;

  try {
    if (req.method === "GET") {
      // ✅ READ records
      const response = await fetch(airtableUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    else if (req.method === "POST") {
      // ✅ CREATE records
      const { records } = req.body;
      if (!records || !Array.isArray(records)) {
        return res.status(400).json({ error: "Missing or invalid 'records' array in body." });
      }

      const response = await fetch(airtableUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ records })
      });

      const data = await response.json();
      return res.status(200).json(data);
    }

    else if (req.method === "PATCH") {
      // 🔁 UPDATE records
      const { records } = req.body;
      if (!records || !Array.isArray(records)) {
        return res.status(400).json({ error: "Missing or invalid 'records' array in body." });
      }

      const response = await fetch(airtableUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ records })
      });

      const data = await response.json();
      return res.status(200).json(data);
    }

    else if (req.method === "DELETE") {
      // ❌ DELETE records
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ error: "Missing or invalid 'ids' array in body." });
      }

      const query = ids.map(id => `records[]=${id}`).join("&");
      const response = await fetch(`${airtableUrl}?${query}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      return res.status(200).json(data);
    }

    else {
      return res.status(405).json({ error: "Method not allowed." });
    }

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
}
