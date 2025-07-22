// pages/api/login.js
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const records = await base('Investors')
      .select({
        filterByFormula: `{Email Address} = "${email}"`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length > 0) {
      const record = records[0];
      const firstName = record.get('First Name') || 'there';
      return res.status(200).json({ firstName });
    } else {
      return res.status(404).json({ message: 'Not found' });
    }
  } catch (err) {
    console.error('Airtable error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}


