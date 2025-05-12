chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyze_news") {
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
              content: "Sen bir medya okuryazarlığı eğitmeni yapay zekasın. Aşağıda bir haber metni var. Haberin dili manipülatif mi? Açıkla. Ardından haberin özetini 3-4 cümleyle detaylı şekilde açıkla.\n\nCevap formatı:\nManipülatif mi?: Evet/Hayır\nSebep: (Tarafsızlık/duygu yüklü dil)\nÖzet: (Haberin içeriğini 3-4 cümleyle açıkla)"
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
        const reply = data.choices?.[0]?.message?.content || "Modelden cevap alınamadı.";
        sendResponse({ message: reply });
      })
      .catch(() => sendResponse({ message: "OpenAI API ile bağlantı kurulamadı." }));
    });
    return true;
  }
});