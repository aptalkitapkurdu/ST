chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyze_drag_text") {
    chrome.storage.local.get("openai_key", (data) => {
      const key = data.openai_key;
      if (!key) {
        sendResponse({ message: "API anahtarı bulunamadı. Lütfen uzantı popup'ından girin." });
        return;
      }

      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + key
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "Sen bir medya okuryazarlığı eğitmeni bir yapay zekasın. Kullanıcı sana bir tweet metni gösterecek. Tweet’i sosyal medya içeriği olarak değerlendir, manipülasyon, yönlendirme, eksik bilgi, duygu sömürüsü içerip içermediğini analiz et.\n\nYalnızca şu yapıda kısa bir yanıt ver:\nManipülatif mi?: Evet/Hayır\nSebep: (tek cümle)"
            },
            {
              role: "user",
              content: request.text
            }
          ]
        })
      })
      .then(res => res.json())
      .then(data => {
        const reply = data.choices?.[0]?.message?.content || "Cevap alınamadı.";
        sendResponse({ message: reply });
      })
      .catch(err => {
        console.error("❌ GPT API hatası:", err);
        sendResponse({ message: "GPT bağlantı hatası." });
      });
    });
    return true;
  }
});