import { runPrompt } from './api.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleListening") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, request);
    });
  } else if (request.action === "setApiKey") {
    // 儲存 API 金鑰
    const apiKey = request.apiKey;
    chrome.storage.sync.set({ gemini_api_key: apiKey }, function () {
      console.log('API key saved:', apiKey);
      sendResponse({ status: 'API Key saved successfully!' }); 
    });
    return true; // 表示我們會非同步發送回應
  } else if (request.action === "askAI") {
    // 將問題發送給 AI 
    handleAIRequest(request, sendResponse);
    return true; // 表示我們會非同步發送回應
  } else if (request.action === "recognitionResult" || 
             request.action === "microphoneError" || 
             request.action === "recognitionStarted" || 
             request.action === "recognitionStopped" || 
             request.action === "recognitionError" || 
             request.action === "recognitionNotSupported") {
    // 將這些消息轉發給 popup
    chrome.runtime.sendMessage(request);
  }
});

async function handleAIRequest(request, sendResponse) {
  const { question, pageContent } = request;
  console.log("Received question:", question);
  console.log("Received page content:", pageContent);

  try {
    const result = await chrome.storage.sync.get(['gemini_api_key']);
    if (result.gemini_api_key) {
      const apiKey = result.gemini_api_key;
      //console.log("API key:", apiKey);

      const generationConfig = {
        temperature: 0.7
      };

      const answer = await runPrompt(apiKey, question, pageContent, generationConfig);
      console.log("AI response:", answer);

      const answerString = typeof answer === 'string' ? answer : JSON.stringify(answer);
      sendResponse({ answer: answerString });
    } else {
      throw new Error("API key not found");
    }
  } catch (error) {
    console.error("Error sending AI request:", error);
    let errorString = "Error sending AI request. Please try again later.";
    if (error.message.includes('Invalid API key')) {
      errorString = "Invalid API key. Please check your API key.";
    } else if (error.message.includes('timeout')) {
      errorString = "Request timeout. Please try again later.";
    } else if (error.message === "API key not found") {
      errorString = "API key not found. Please set your API key.";
    }
    sendResponse({ error: errorString });
  }
}