// API route for connecting companies
// In production, this would send notifications and manage connections

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fromCompanyId, toCompanyId, message, synergyType } = req.body;

  if (!fromCompanyId || !toCompanyId) {
    return res.status(400).json({ error: 'Missing required data' });
  }

  // Validate field lengths (prevent DOS attacks)
  if (fromCompanyId.length > 100 || toCompanyId.length > 100) {
    return res.status(400).json({ error: 'Invalid company ID format' });
  }
  if (message && message.length > 2000) {
    return res.status(400).json({ error: 'Message is too long (max 2000 characters)' });
  }
  if (synergyType && synergyType.length > 100) {
    return res.status(400).json({ error: 'Synergy type is too long (max 100 characters)' });
  }

  try {
    // In production, this would:
    // 1. Save connection request to database
    // 2. Send email notification to target company
    // 3. Create connection record
    // 4. Log activity

    // For now, return success - client will handle storage
    const connection = {
      id: `conn_${Date.now()}`,
      fromCompanyId,
      toCompanyId,
      message: message || `Hej! Vi skulle gärna utforska synergier med er.`,
      synergyType: synergyType || 'Generellt samarbete',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    return res.status(200).json({
      success: true,
      message: 'Anslutningsförfrågan skickad!',
      connection,
    });
  } catch (error) {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Connection error:', error);
    }
    return res.status(500).json({ error: 'Failed to create connection' });
  }
}


