import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: "HUGGINGFACE_API_KEY is missing in .env.local" }, { status: 500 });
  }

  console.log(`API Key present (starts with): ${apiKey.substring(0, 4)}...`);

  const model = 'https://router.huggingface.co/models/sshleifer/distilbart-cnn-12-6';
  const testText = "The quick brown fox jumps over the lazy dog. This is a test sentence to see if the summarization model is working correctly. It should return a shorter version of this text.";

  console.log(`[Test-HF] Attempting to POST to: ${model}`);

  try {
    const response = await axios.post(
      model,
      {
        inputs: testText,
        parameters: {
          max_length: 20,
          min_length: 5,
          do_sample: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    return NextResponse.json({
      status: "success",
      model: model,
      input: testText,
      response: response.data
    });

  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: error.message,
      details: error.response?.data || "No additional error details",
      headers: error.response?.headers
    }, { status: error.response?.status || 500 });
  }
}