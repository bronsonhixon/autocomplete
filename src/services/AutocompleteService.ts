// src/services/AutocompleteService.ts
import axios from "axios";

const API_KEY = "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"; 
const BASE_URL = "https://api.openai.com/v1/chat/completions";

export async function getAutocompleteSuggestions(query: string): Promise<string[]> {
    console.log(`🔍 Sending query to OpenAI: "${query}"`);

    try {
        const response = await axios.post(
            BASE_URL,
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are an autocomplete AI that predicts full real estate search queries based on user input. Provide a completed query, do NOT ask follow-up questions. Do not use quotations in your predictions, only the prediction. Always put real locations, never use placeholders for things." },
                    { role: "user", content: `Complete this search: "${query}"` }
                ],
                max_tokens: 50,
                temperature: 0.3
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`,
                },
            }
        );

        console.log("✅ OpenAI Response:", response.data);

        // Extract text from OpenAI response
        const text = response.data.choices[0]?.message?.content?.trim();
        if (text) {
            console.log(`🎯 Suggested Completion: ${text}`);
            return [text];
        } else {
            console.log("⚠️ No suggestion returned");
            return [];
        }
    } catch (error) {
        console.error("❌ OpenAI API Error:", error);
        return [];
    }
}