import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Server configuration error: GEMINI_API_KEY is not set." },
      { status: 500 }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(prompt || "Say hello!");
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ success: true, aiResponse: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to get AI response from Google Gemini",
      },
      { status: 500 }
    );
  }
}
