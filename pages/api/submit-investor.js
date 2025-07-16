import fetch from 'node-fetch';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;

  const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
  const form = req.body;

  try {
    // 1. Save to Airtable
    const airtableRes = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          "First Name": form.firstName,
          "Surname": form.surname,
          "Email Address": form.email,
          "LinkedIn": form.linkedIn,
          "Job Title": form.jobTitle,
          "Company": form.company,
          "Location": form.location,
          "Description": form.description,
          "What's your motivation to join CivilizationX?": form.motivation,
          "What do you hope to get out of becoming a member?": form.goals,
          "Investment Experience": form.experience,
          "Angel Investment Made?": form.angel,
          "Investment Areas": form.areas,
        },
      }),
    });

    const airtableData = await airtableRes.json();

    if (!airtableData.id) throw new Error('Airtable insert failed');

    // 2. Send Welcome Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"CivilizationX" <${process.env.GMAIL_USER}>`,
      to: form.email,
      subject: 'Welcome to CivilizationX!',
      text: `Hi ${form.firstName},

Thank you for your interest in joining CivilizationX. CivilizationX is a global syndicate of startups, advisors, and investors working at the intersection of AI and deep tech. Our mission is to accelerate innovation in AI infrastructure by supporting highly technical early-stage teams. We do this by offering:

- Exclusive deal flow in AI infra and deep tech
- Hands-off investing (we handle diligence, terms, etc.)
- Opportunities to actively engage with portfolio startups
- Learning and networking through events, talks, and a monthly newsletter

I'd love to invite you to a short introduction call so we can learn more about your interests and share how you can get the most out of CivilizationX.

Would you be available for a quick 20-minute call next week? Feel free to propose a time that works best for you and I will send an invite.

Looking forward to connecting!

Mabel Ubong  
CivilizationX  
https://www.civilizationx.co.uk  
X (formerly Twitter) | LinkedIn  
Book a Meeting: https://calendar.app.google/NLgc8M2hByd65TYt8`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}

