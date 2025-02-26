const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAi = new GoogleGenerativeAI(process.env.API_KEY);
export async function POST(request) {
  const data = await request.json();
  console.log("Data received:", data.message);
  const model = genAi.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `generate article based on the following topic  ${data.message} and should be less than 300 words`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  console.log(text,"res");

  return Response.json(text);
}