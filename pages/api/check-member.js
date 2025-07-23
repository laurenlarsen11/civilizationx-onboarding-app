import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  const { email } = req.body;

  try {
    const records = await base('Investors')
      .select({
        filterByFormula: `{Email Address} = '${email}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length > 0) {
      const record = records[0];
      const firstName = record.get('First Name') || '';
      res.status(200).json({ found: true, firstName });
    } else {
      res.status(200).json({ found: false });
    }
  } catch (error) {
    console.error('Error checking member:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

  