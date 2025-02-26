const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
export async function POST(request) {
  const data = await request.json();
  console.log("Data received:", data.message);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `generate answer to users question  ${data.message} and should be simple and should not have any non alphabet characters`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  console.log(text,"res");

  return Response.json(text);
}