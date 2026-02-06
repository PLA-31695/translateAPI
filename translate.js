export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  const API_KEY = process.env.AI_API_KEY; // 在 Vercel 后台设置这个环境变量

  try {
    // 这里以调用 DeepSeek 为例
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "你是一个英语老师，翻译并分析单词语法。用---分隔翻译和分析。" },
          { role: "user", content: text }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json({ result: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Vercel 转发失败" });
  }
}