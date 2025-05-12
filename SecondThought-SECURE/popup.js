function saveKey() {
  const key = document.getElementById("keyInput").value.trim();
  if (key.startsWith("sk-")) {
    chrome.storage.local.set({ openai_key: key }, () => {
      alert("API key kaydedildi!");
    });
  } else {
    alert("Geçerli bir OpenAI API key girin (sk- ile başlamalı).");
  }
}