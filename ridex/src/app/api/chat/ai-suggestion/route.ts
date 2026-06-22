import connectDB from "@/lib/db";
import chatMessageModel from "@/models/chatMessageModel";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
const geminiUrl = process.env.GEMINI_API_URL

export async function POST(req: NextRequest) {
  try {
    if (!geminiUrl) {
      return NextResponse.json(
        { message: "GEMINI_API_URL is not configured" },
        { status: 500 }
      )
    }

    await connectDB()
    const { lastMessage, role } = await req.json()
    const prompt = `
You are an AI reply suggestion system for a vehicle booking chat app.

ROLE indicates who sent the RECENT_MESSAGE.

Rules:
- If ROLE = DRIVER, generate replies that the USER would send.
- If ROLE = USER, generate replies that the DRIVER would send.
- Return exactly 6 suggestions.
- Keep replies short (3-12 words).
- Match the conversation context and tone.
- Driver replies should be professional and helpful.
- User replies should be natural and realistic.
- Avoid repetition.
- Understand Hindi, Hinglish, and English messages.
- Return ONLY valid JSON.

Output format:
{
  "suggestions": [
    "Reply 1",
    "Reply 2",
    "Reply 3",
    "Reply 4",
    "Reply 5",
    "Reply 6"
  ]
}

Input:
ROLE: '${role}' 
RECENT_MESSAGE: "${lastMessage}"
`;
    const response = await axios.post(geminiUrl,
      {
        "contents": [
          {
            "parts": [
              {
                "text": `${prompt}`
              }
            ]
          }
        ]
      }
    )
    console.log(response.data.candidates[0].content.parts[0].text)
    // const suggestions = response.data.candidates[0].content.parts[0].text

    // return NextResponse.json(
    //   suggestions, { status: 200 }
    // )
    const rawText =
  response.data.candidates[0].content.parts[0].text

// remove ```json wrappers if Gemini adds them
const cleaned = rawText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim()

const parsed = JSON.parse(cleaned)

return NextResponse.json(parsed, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: error.response?.status,
        error: error.response?.data
      },
      {
        status: error.response?.status || 500
      }
    )
  }
}