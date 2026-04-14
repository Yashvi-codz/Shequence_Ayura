import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { message, history = [], profile = {} } = body;

    const systemPrompt = `
You are Ayura, a helpful Ayurvedic wellness assistant.
You give safe, simple, wellness-related suggestions.
You do not diagnose diseases.
You do not replace doctors.

User profile:
- Dosha: ${profile.dosha || "unknown"}
- Goals: ${profile.goals || "not provided"}
- Diet: ${profile.diet || "not provided"}
- Pantry: ${profile.pantry?.join(", ") || "not provided"}

Keep answers simple, practical, and calm.
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // free + stable
        messages: [
          { role: "system", content: systemPrompt },
          ...history,
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log("OPENROUTER RESPONSE:", JSON.stringify(data, null, 2));

    let reply = "Sorry, I couldn't generate a response.";

    if (data?.choices?.length > 0) {
      reply = data.choices[0]?.message?.content || reply;
    } else if (data?.error) {
      console.error("OpenRouter Error:", data.error);
      reply = "Error: " + data.error.message;
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json(
      { reply: "Something went wrong." },
      { status: 500 }
    );
  }
}