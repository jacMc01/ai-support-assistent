import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a customer support quality analyst. When given a customer support message, analyze it and respond with ONLY a valid JSON object — no markdown, no explanation, no code fences.

The JSON must have exactly these fields:
{
  "category": string,       // e.g. "Billing", "Technical", "Account", "General"
  "priority": string,       // "Low", "Medium", "High", or "Urgent"
  "sentiment": string,      // "Positive", "Neutral", "Frustrated", or "Angry"
  "summary": string,        // 1-2 sentence summary of the customer's issue
  "response": string,       // A professional, empathetic suggested reply to send to the customer
  "scores": {
    "clarity": number,               // 0-100
    "helpfulness": number,           // 0-100
    "professionalism": number,       // 0-100
    "instructionFollowing": number   // 0-100
  },
  "overallScore": number    // 0-100, weighted average of scores
}`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const result = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 1024,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: message.trim() }],
    });

    const textBlock = result.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    const parsed = JSON.parse(textBlock.text);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Analyze API error:", err);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
