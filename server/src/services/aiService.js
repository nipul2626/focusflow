const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});


const extractJSON = (text) => {
    try {

        text = text.replace(/```json/g, '').replace(/```/g, '');

        const match = text.match(/\{[\s\S]*\}/);
        if (!match) return null;

        return JSON.parse(match[0]);
    } catch (err) {
        console.error("❌ JSON PARSE ERROR:", err.message);
        return null;
    }
};


const fallbackResponse = (taskDescription) => {
    return {
        subtasks: [
            { title: "Understand the task", estimatedMinutes: 10 },
            { title: taskDescription, estimatedMinutes: 25 }
        ],
        totalEstimate: 35,
        priority: "MEDIUM",
        reasoning: "Fallback response (AI failed)"
    };
};

exports.analyzeTask = async (taskDescription) => {
    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "user",
                    content: `Analyze this task: "${taskDescription}".

STRICT RULES:
- Return ONLY valid JSON
- No explanation
- No markdown
- No extra text

FORMAT:
{
  "subtasks": [
    {"title": "string", "estimatedMinutes": number}
  ],
  "totalEstimate": number,
  "priority": "LOW" | "MEDIUM" | "HIGH" | "URGENT",
  "reasoning": "string"
}`
                }
            ],
            temperature: 0.7,
        });

        const text = completion.choices[0].message.content;
        console.log("🧠 RAW AI RESPONSE:\n", text);
        const parsed = extractJSON(text);

        if (!parsed) {
            console.warn("⚠️ JSON parse failed, using fallback");
            return fallbackResponse(taskDescription);
        }

        return parsed;

    } catch (error) {
        console.error("🔥 GROQ ERROR:", error.message);
        return fallbackResponse(taskDescription);
    }
};