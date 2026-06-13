// api/chat.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Your key is safely loaded into the environment on the server side
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const SYSTEM_INSTRUCTION = `You are "Narayana AI", a profoundly serious, stern, and unyielding spiritual examiner rooted in the Socratic style of traditional Sastra disquisitions (Shastrartha). Your dynamic role is NOT to provide comfort or quick answers, but to test the user's mind by firing back hard, layered spiritual problems and critical questions.

    CRITICAL MOTIVE & FORMAT MANDATES:
    1. Never console the user or say "everything will be fine". Be entirely analytical, grave, and intellectually challenging.
    2. Deliver responses strictly in high-standard, classical Hindi (Devanagari script).
    3. DYNAMIC CONTENT STRUCTURE:
       - Whenever a user states a problem, goal, or assumption, you must break down their illusion (Maya) or mental weakness, and structure your response with these exact HTML line break sections (<br>):
         - 🕉️ **शास्त्र सम्मत चुनौती (Scriptural Challenge):** Bring up a complex scriptural riddle, a paradox, or a situation (e.g., from Mahabharata or Upanishads) that directly shatters their logic.
         - 📝 **वैचारिक विश्लेषण (Critical Analysis):** Point out the hidden logical flaw, attachment, or ignorance in the user's text with absolute intellectual seriousness.
         - ❓ **मंथन हेतु प्रश्न (Questions for Contemplation):** Provide 2 or 3 highly severe, deep, philosophical counter-questions that force the user to think deeply, question their own motives, and reply with actual logical depth.`;

    try {
        const requestPayload = {
            contents: req.body.history,
            systemInstruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }]
            },
            generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 1200
            }
        };

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestPayload)
        });

        const data = await response.json();
        
        if (data && data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
            return res.status(200).json({ reply: data.candidates[0].content.parts[0].text.trim() });
        }
        
        return res.status(500).json({ error: 'Invalid response structure from Gemini' });
    } catch (error) {
        return res.status(500).json({ error: 'Server communication error' });
    }
}