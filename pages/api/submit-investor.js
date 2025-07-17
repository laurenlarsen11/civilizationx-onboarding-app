import nodemailer from 'nodemailer';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_PASS;

  const form = req.body;

  try {
    // 1. Submit to Airtable
    const airtableResponse = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
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
          "First Email Sent": new Date().toLocaleDateString("en-CA"), // format: YYYY-MM-DD
        },
      }),
    });

    const airtableData = await airtableResponse.json();

    if (!airtableData.id) {
      console.error('❌ Airtable insert failed:', airtableData);
      return res.status(500).json({ error: 'Airtable submission failed.' });
    }

    // 2. Send Welcome Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const fullName = `${form.firstName} ${form.surname}`;
    const mailOptions = {
      from: `"Mabel Ubong" <${gmailUser}>`,
      to: form.email,
      subject: 'Welcome to CivilizationX!',
      html: `
        <p>Hi ${form.firstName},</p>
        <p>Thank you for your interest in joining CivilizationX. CivilizationX is a global syndicate of startups, advisors, and investors working at the intersection of AI and deep tech. Our mission is to accelerate innovation in AI infrastructure by supporting highly technical early-stage teams. We do this by offering:</p>
        <ul>
          <li>Exclusive deal flow in AI infra and deep tech</li>
          <li>Hands-off investing (we handle diligence, terms, etc.)</li>
          <li>Opportunities to actively engage with portfolio startups</li>
          <li>Learning and networking through events, talks, and a monthly newsletter</li>
        </ul>
        <p>I'd love to invite you to a short introduction call so we can learn more about your interests and share how you can get the most out of CivilizationX.</p>
        <p>Would you be available for a quick 20-minute call next week? Feel free to propose a time that works best for you and I will send an invite.</p>
        <p><strong><a href="https://calendar.app.google/NLgc8M2hByd65TYt8" target="_blank">Book a Meeting</a></strong></p>
        <br />
        <p>Looking forward to connecting!</p>
        <p><strong>Mabel Ubong</strong><br/>Civilization X<br/>
        <a href="https://www.civilizationx.co.uk">https://www.civilizationx.co.uk</a><br/>
        X (formerly Twitter) | LinkedIn</p>
      `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent to', form.email);
      } catch (emailErr) {
        console.error('❌ Email failed to send:', emailErr);
        // don't throw error — still return success to frontend
      }
      
      return res.status(200).json({ success: true });
      

  } catch (error) {
    console.error('❌ Submission failed:', error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
}


