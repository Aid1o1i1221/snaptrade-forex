
const SUPABASE_URL = "https://ewcskjcjnhewiwqkkvho.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // Shortened for safety
const BUCKET = "charts";

async function uploadImage() {
  const file = document.getElementById("imageInput").files[0];
  if (!file) return alert("No file selected");

  const filePath = `${Date.now()}_${file.name}`;
  const { data, error } = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filePath}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": file.type,
      "x-upsert": "true"
    },
    body: file
  }).then(res => res.json());

  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filePath}`;
  document.getElementById("preview").src = publicUrl;
  document.getElementById("preview").classList.remove("hidden");

  // Send to AI
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4-vision-preview",
      messages: [
        { role: "system", content: "You are a forex chart analyst. Say BUY, SELL, or HOLD based on trends." },
        { role: "user", content: [
          { type: "image_url", image_url: { url: publicUrl } },
          { type: "text", text: "Based on this chart, what is your trading signal?" }
        ]}
      ],
      max_tokens: 100
    })
  }).then(res => res.json());

  const result = response.choices?.[0]?.message?.content || "No result";
  document.getElementById("prediction").textContent = `AI Prediction: ${result}`;
  document.getElementById("prediction").classList.remove("hidden");
}
