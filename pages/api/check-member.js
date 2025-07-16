import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { email } = req.body;
  
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME;
  
    const url = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=({Email Address}="${email}")`;
  
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
  
      const data = await response.json();
  
      if (data.records.length > 0) {
        const name = data.records[0].fields["First Name"] || "Investor";
        res.status(200).json({ exists: true, name });
      } else {
        res.status(200).json({ exists: false });
      }
    } catch (error) {
      console.error("Airtable error:", error);
      res.status(500).json({ error: "Something went wrong." });
    }
  }
  