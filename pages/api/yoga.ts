import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { level, type, funny, duration, prompt } = req.query;
  if (prompt === undefined) {
    prompt = "";
  }
  if (prompt.length > 200) {
    return res.status(400).json({ error: "prompt too long" });
  }
  let temperature = 1;
  if (funny === "funny") {
    temperature = 10;
    prompt += " in a funny way";
  }
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Create a ${level} ${type} yoga routine for ${duration} minutes based on the following needs:\n\n${prompt}\n\nYoga Routine:`,
    max_tokens: 500,
    temperature: temperature, //creativity
    presence_penalty: 0,
    frequency_penalty: 0, //not repeat
  });
  const routine = completion.data.choices[0].text;
  res.status(200).json({ routine });
}
