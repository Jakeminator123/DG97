/**
 * Contact Form API Route
 * Handles form submissions from contact page
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Namn, e-post och meddelande är obligatoriska' });
    }

    // Validate field lengths (prevent DOS attacks)
    if (name.length > 100) {
      return res.status(400).json({ error: 'Namn är för långt (max 100 tecken)' });
    }
    if (email.length > 254) {
      return res.status(400).json({ error: 'E-postadress är för lång' });
    }
    if (message.length > 5000) {
      return res.status(400).json({ error: 'Meddelande är för långt (max 5000 tecken)' });
    }
    if (phone && phone.length > 50) {
      return res.status(400).json({ error: 'Telefonnummer är för långt' });
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Ogiltig e-postadress' });
    }

    // In production, send email notification or save to database
    // For now, log the submission (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Contact form submission:', {
        name,
        email,
        phone: phone || 'N/A',
        message,
        timestamp: new Date().toISOString()
      });
    }

    // TODO: Send email notification to hej@dg97.se
    // TODO: Save to database for tracking
    // TODO: Send auto-reply confirmation email

    return res.status(200).json({
      success: true,
      message: 'Meddelandet har skickats. Vi återkommer så snart som möjligt.'
    });

  } catch (error) {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Contact form error:', error);
    }
    return res.status(500).json({ error: 'Fel vid skickande av meddelande. Försök igen senare.' });
  }
}

