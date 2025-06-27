export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const analysis = analyzeText(text);
    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Analysis failed' });
  }
}

function analyzeText(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());

  const passivePatterns = [
    /\b(am|is|are|was|were|being|been|be)\s+(being\s+)?(\w+ly\s+)?(\w*ed|\w*en)\b/gi,
    /\b(am|is|are|was|were|being|been|be)\s+(being\s+)?(chosen|taken|given|written|spoken|broken|frozen|stolen|forgotten|ridden|driven|thrown|shown|known|grown|flown|blown|drawn|worn|torn|born|sworn|done|gone|seen|been|made|said|paid|laid|built|sent|spent|kept|left|felt|meant|dealt|heard|sold|told|held|found|bound|wound|lost|cost|cut|hit|hurt|put|shut|let|set|bet|quit|split|spread|read|led|fed|bred|fled|shed|sped|wed|bled)\b/gi
  ];

  const toBeVerbs = ['am', 'is', 'are', 'was', 'were', 'being', 'been', 'be', "isn't", "aren't", "wasn't", "weren't"];

  let passiveCount = 0;
  let toBeCount = 0;
  let suggestions = [];

  passivePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) passiveCount += matches.length;
  });

  const words = text.toLowerCase().split(/\s+/);
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w']/g, '');
    if (toBeVerbs.includes(cleanWord)) {
      toBeCount++;
    }
  });

  if (passiveCount > 0) {
    suggestions.push('Try converting passive sentences to active voice for more engaging writing!');
  }
  if (toBeCount > sentences.length * 0.3) {
    suggestions.push("Consider replacing some 'to be' verbs with action verbs to make your writing more dynamic!");
  }

  const wordCount = words.length;
  const avgWordsPerSentence = wordCount / sentences.length;
  const readabilityScore = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence * 2)));

  return {
    passiveCount,
    toBeCount,
    wordCount,
    sentenceCount: sentences.length,
    suggestions,
    readabilityScore: Math.round(readabilityScore),
    timestamp: new Date().toISOString()
  };
}

