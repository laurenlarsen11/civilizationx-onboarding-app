// /pages/api/send-followups.js
import Airtable from 'airtable';
import nodemailer from 'nodemailer';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  const today = new Date();
  const fourDaysAgo = new Date(today);
  fourDaysAgo.setDate(today.getDate() - 4);

  const recordsToFollowUp = [];

  await base('Investors').select().eachPage((records, fetchNextPage) => {
    records.forEach(record => {
      const firstEmail = record.get('First Email Sent');
      const responded = record.get('Responded');
      const followupSent = record.get('Follow-up Sent');

      if (firstEmail && !responded && !followupSent) {
        const emailSentDate = new Date(firstEmail);
        const daysSince = Math.floor((today - emailSentDate) / (1000 * 60 * 60 * 24));

        if (daysSince >= 4) {
          recordsToFollowUp.push(record);
        }
      }
    });
    fetchNextPage();
  });

  for (const record of recordsToFollowUp) {
    const email = record.get('Email');
    const name = record.get('First Name') || "there";

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: `Just checking in, ${name}`,
        text: `Hi ${name},
      
      Just circling back in case you missed my last message. CivilizationX is growing quickly, and we’re excited to bring on new members who are passionate about AI infrastructure and early-stage innovation.
      
      Joining means access to exclusive deal flow, hands-off investing, and a vibrant network of founders and fellow investors.
      
      I’d love to schedule a quick intro call to see if there’s a good fit. Are you free for 20 minutes next week? You can also pick a time that works best for you here: https://calendar.app.google/NLgc8M2hByd65TYt8
      
      Best regards,  
      The CivilizationX Team`,
      };      

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Follow-up sent to ${email}`);

      // ✅ Mark follow-up as sent in Airtable
      await base('Investors').update(record.id, {
        'Follow-up Sent': true
      });

    } catch (error) {
      console.error(`Failed to send to ${email}:`, error);
    }
  }

  res.status(200).json({ message: `Processed ${recordsToFollowUp.length} follow-ups` });
}

