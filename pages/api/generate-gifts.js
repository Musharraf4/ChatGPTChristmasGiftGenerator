import { Configuration, OpenAIApi } from "openai";
import { MongoClient } from "mongodb";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const { priceMin, priceMax, gender, age, hobbies } = req.body;
  const prompt = generatePrompt(priceMin, priceMax, gender, age, hobbies);

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.6,
    max_tokens: 2048,
  });
  res.status(200).json({ result: completion.data.choices[0].text });
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.DB_CONNECTION_USERNAME}:${process.env.DB_CONNECTION_PASSWORD}@imagegenerator.8673col.mongodb.net/?retryWrites=true&w=majority`
  )
  const db= client.db("imageGenerator")

  await db.collection("gift_generator").insertOne({ priceMin, priceMax, gender, age, hobbies,prompt,result:completion.data.choices[0].text })
}
function generatePrompt(priceMin, priceMax, gender, age, hobbies) {
 
  return `suggest 3 christmas gift ideas between ${priceMin} and ${priceMax} for a ${age} years old ${gender} that is into ${hobbies}`;
}
