// API route for AI-powered synergy analysis
// Currently uses rule-based matching - can be enhanced with OpenAI API integration
// To integrate OpenAI: use gpt-4o or gpt-4o-mini models (see https://platform.openai.com/docs/api-reference/models)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { myCompany, otherCompanies } = req.body;

  if (!myCompany || !otherCompanies || !Array.isArray(otherCompanies)) {
    return res.status(400).json({ error: 'Missing required data' });
  }

  // Validate array size (prevent DOS attacks)
  if (otherCompanies.length > 100) {
    return res.status(400).json({ error: 'Too many companies (max 100)' });
  }

  try {
    // Simulate AI analysis with GPT-like reasoning
    const analyzedSynergies = otherCompanies.map(company => {
      let matchScore = 0;
      const reasons = [];
      const synergies = [];

      // Industry complementarity analysis
      if (myCompany.industry && company.industry) {
        if (myCompany.industry !== company.industry) {
          matchScore += 15;
          reasons.push(`Kompletterande branscher: ${myCompany.industry} + ${company.industry}`);
        } else {
          matchScore += 10;
          reasons.push(`Samma bransch: ${myCompany.industry} - möjlighet till samarbete`);
        }
      }

      // Synergy interests matching
      if (myCompany.synergyInterests && company.synergyInterests) {
        const matches = myCompany.synergyInterests.filter(interest =>
          company.synergyInterests.includes(interest)
        );
        if (matches.length > 0) {
          matchScore += matches.length * 25;
          reasons.push(`Gemensamma synergiintressen: ${matches.join(', ')}`);
          synergies.push(...matches);
        }
      }

      // Target audience analysis
      if (myCompany.targetAudience && company.targetAudience) {
        const myTarget = myCompany.targetAudience.toLowerCase();
        const theirTarget = company.targetAudience.toLowerCase();

        // Check for overlap or complementarity
        const commonWords = myTarget.split(/\s+/).filter(word =>
          word.length > 3 && theirTarget.includes(word)
        );

        if (commonWords.length > 0) {
          matchScore += commonWords.length * 12;
          reasons.push(`Liknande målgrupp: Överlappande kundgrupper`);
        } else if (myTarget && theirTarget) {
          matchScore += 8;
          reasons.push(`Kompletterande målgrupper: Kan referera kunder till varandra`);
        }
      }

      // Services complementarity
      if (myCompany.services && company.services) {
        const myServices = myCompany.services.toLowerCase();
        const theirServices = company.services.toLowerCase();

        // Check for complementary services
        const complementaryKeywords = {
          'marknadsföring': ['design', 'webb', 'content'],
          'webb': ['marknadsföring', 'design', 'seo'],
          'design': ['marknadsföring', 'webb', 'branding'],
          'konsulting': ['utveckling', 'design', 'marknadsföring'],
          'utveckling': ['design', 'konsulting', 'marknadsföring'],
        };

        let foundComplement = false;
        for (const [key, values] of Object.entries(complementaryKeywords)) {
          if (myServices.includes(key)) {
            const hasComplement = values.some(val => theirServices.includes(val));
            if (hasComplement) {
              matchScore += 20;
              reasons.push(`Kompletterande tjänster: ${key} + ${values.find(v => theirServices.includes(v))}`);
              foundComplement = true;
              break;
            }
          }
        }

        if (!foundComplement && myServices && theirServices) {
          matchScore += 5;
        }
      }

      // Description similarity (AI-like semantic analysis)
      if (myCompany.description && company.description) {
        const myDesc = myCompany.description.toLowerCase();
        const theirDesc = company.description.toLowerCase();

        const keywords = ['startup', 'innovation', 'tech', 'digital', 'modern', 'flexibel', 'lösning', 'kund'];
        const commonKeywords = keywords.filter(kw =>
          myDesc.includes(kw) && theirDesc.includes(kw)
        );

        if (commonKeywords.length > 0) {
          matchScore += commonKeywords.length * 5;
          reasons.push(`Liknande värderingar och fokus`);
        }
      }

      // Employees size complementarity
      if (myCompany.employees && company.employees) {
        const mySize = parseInt(myCompany.employees) || 0;
        const theirSize = parseInt(company.employees) || 0;

        if (mySize > 0 && theirSize > 0) {
          const sizeDiff = Math.abs(mySize - theirSize);
          if (sizeDiff < 5) {
            matchScore += 10;
            reasons.push(`Liknande företagsstorlek: Lättare att samarbeta`);
          } else if (sizeDiff > 10) {
            matchScore += 8;
            reasons.push(`Kompletterande storlekar: En kan lära av den andra`);
          }
        }
      }

      // Normalize score to 0-100
      const normalizedScore = Math.min(100, Math.round(matchScore));

      return {
        ...company,
        matchScore: normalizedScore,
        reasons: reasons.length > 0 ? reasons : ['Grundläggande matchning'],
        synergies: synergies.length > 0 ? synergies : ['Generellt samarbete'],
        aiAnalysis: generateAIAnalysis(myCompany, company, normalizedScore, reasons, synergies),
      };
    });

    // Sort by match score
    analyzedSynergies.sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json({
      success: true,
      synergies: analyzedSynergies,
      totalFound: analyzedSynergies.length,
    });
  } catch (error) {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Synergy analysis error:', error);
    }
    return res.status(500).json({ error: 'Failed to analyze synergies' });
  }
}

// Generate AI-like analysis text
function generateAIAnalysis(myCompany, company, score, reasons, synergies) {
  const scoreLevel = score >= 70 ? 'hög' : score >= 50 ? 'medel' : 'läg';

  let analysis = `AI-analys visar en ${scoreLevel} matchningsgrad (${score}%) mellan ${myCompany.companyName || 'ert företag'} och ${company.companyName || 'detta företag'}. `;

  if (reasons.length > 0) {
    analysis += `Huvudskäl för matchning: ${reasons.slice(0, 2).join('; ')}. `;
  }

  if (synergies.length > 0) {
    analysis += `Specifika synergimöjligheter: ${synergies.join(', ')}. `;
  }

  analysis += `Rekommendation: ${score >= 70 ? 'Starkt rekommenderat att kontakta detta företag för potentiellt värdefullt samarbete.' : score >= 50 ? 'Värt att utforska möjligheter till samarbete.' : 'Kan vara värt att lära känna för framtida möjligheter.'}`;

  return analysis;
}


