import axios from "axios";
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

const prompt =
  "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

export async function POST(req: Request) {
  try {
    const response = await axios.post(
      `${OPENAI_BASE_URL}/chat/completions`,
      {
        model: "us.meta.llama4-scout-17b-instruct-v1:0",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 400,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    return Response.json(
      {
        success: true,
        message: "Questions generated successfully.",
        messages: response.data.choices[0].message.content,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return Response.json(
      {
        success: false,
        message: "An unexpected error occurred while generating questions.",
      },
      { status: 500 }
    );
  }
}
