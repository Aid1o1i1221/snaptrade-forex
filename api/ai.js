export default async function handler(req, res) {
  const { input } = req.body;

  if (!input) return res.status(400).json({ error: "Missing input" });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: input }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return res.status(200).json(data.choices[0].message.content);
  } catch (err) {
    return res.status(500).json({ error: "Error connecting to AI" });
  }
}


Add OpenAI backend API route

