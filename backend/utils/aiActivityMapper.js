const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Maps a custom/misc activity text to the closest standard activity in the DB
 * @param {string} customText - what the employee typed
 * @param {Array} activities - array of { _id, name } from the department's activities
 * @returns {{ matchedActivity: { _id, name }, confidence: string, reason: string }}
 */
async function mapActivity(customText, activities) {
  if (!activities || activities.length === 0) {
    return { matchedActivity: null, confidence: 'low', reason: 'No standard activities available.' };
  }

  const activityList = activities.map((a, i) => `${i + 1}. ${a.name} (ID: ${a._id})`).join('\n');

  const prompt = `You are an AI assistant for an employee performance review system (ePER).
An employee has entered a custom/miscellaneous activity description:
"${customText}"

Below is the list of standard activities for their department:
${activityList}

Your task:
1. Identify which standard activity best matches the custom description.
2. Rate your confidence as high, medium, or low.
3. Explain briefly why it matches.

Respond ONLY with valid JSON in this exact format (no markdown, no explanation outside JSON):
{
  "matchedIndex": <number 1-${activities.length} or null if no match>,
  "confidence": "high" | "medium" | "low",
  "reason": "<one sentence explanation>"
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }]
    });

    const raw = message.content[0].text.trim();
    const parsed = JSON.parse(raw);

    if (parsed.matchedIndex === null || parsed.matchedIndex < 1 || parsed.matchedIndex > activities.length) {
      return { matchedActivity: null, confidence: 'low', reason: parsed.reason || 'No close match found.' };
    }

    const matched = activities[parsed.matchedIndex - 1];
    return {
      matchedActivity: { _id: matched._id, name: matched.name },
      confidence: parsed.confidence,
      reason: parsed.reason
    };
  } catch (err) {
    console.error('AI mapping error:', err.message);
    return { matchedActivity: null, confidence: 'low', reason: 'AI mapping failed. Please select manually.' };
  }
}

module.exports = { mapActivity };
