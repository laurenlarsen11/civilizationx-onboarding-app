import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;

  try {
    let userFound = false;
    let userName = '';

    await base('Investors').select().eachPage((records, fetchNextPage) => {
      records.forEach(record => {
        if (record.get('Email') === email) {
          userFound = true;
          userName = record.get('First Name');
        }
      });
      fetchNextPage();
    });

    if (userFound) {
      return res.status(200).json({
        redirect: `https://investor-workflow-ui.vercel.app?name=${encodeURIComponent(userName)}`
      });
    } else {
      return res.status(200).json({ redirect: '/join' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
