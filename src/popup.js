document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('startListening').addEventListener('click', toggleListening);
  document.getElementById('saveApiKey').addEventListener('click', saveApiKey);
  document.getElementById('analyzeText').addEventListener('click', analyzeRecognizedText);

  // Load saved API key
  chrome.storage.sync.get(['gemini_api_key'], function(result) {
    if (result.gemini_api_key) {
      document.getElementById('apiKey').value = result.gemini_api_key;
    }
  });

  // Listen for messages from background.js
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
      case "recognitionResult":
        document.getElementById('recognizedText').value = request.text;
        break;
      case "microphoneError":
        displayMessage("Microphone Error: " + request.error, "error");
        break;
      case "recognitionStarted":
        document.getElementById('startListening').textContent = "Stop Listening";
        displayMessage("Listening...", "info");
        break;
      case "recognitionStopped":
        document.getElementById('startListening').textContent = "Start Listening";
        displayMessage("Listening stopped.", "info");
        break;
      case "recognitionError":
        displayMessage("Recognition Error: " + request.error, "error");
        break;
      case "recognitionNotSupported":
        displayMessage("Web Speech API is not supported in this browser.", "error");
        break;
    }
  });
});

function saveApiKey() {
  const apiKey = document.getElementById('apiKey').value;
  if (!apiKey) {
    displayMessage("Please enter an API key.", "error");
    return;
  }
  chrome.runtime.sendMessage({action: "setApiKey", apiKey: apiKey}, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Error saving API key:", chrome.runtime.lastError);
      displayMessage("Error saving API key: " + chrome.runtime.lastError.message, "error");
    } else if (response && response.status) {
      displayMessage(response.status, "success");
      console.log("API key saved:", apiKey);
    } else {
      displayMessage("Unknown error occurred while saving API key.", "error");
    }
  });
}

function toggleListening() {
  const button = document.getElementById('startListening');
  if (button.textContent === "Stop Listening") {
    chrome.runtime.sendMessage({ action: "toggleListening", state: "stop" });
    button.textContent = "Start Listening";
    displayMessage("Stopping listening...", "info");
  } else {
    chrome.runtime.sendMessage({ action: "toggleListening", state: "start" });
    button.textContent = "Stop Listening";
    displayMessage("Starting listening...", "info");
  }
}

function analyzeRecognizedText() {
  const recognizedText = document.getElementById('recognizedText').value;
  if (recognizedText.trim() === '') {
    displayMessage('Please speak or type a question first.', "error");
    return;
  }

  sendQuestionToAI(recognizedText);
}

function sendQuestionToAI(question) {
  displayMessage('Analyzing...', "info");
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: "getPageContent"}, (response) => { 
      if (chrome.runtime.lastError) {
        console.error("Error getting page content:", chrome.runtime.lastError);
        displayMessage('Error: Unable to get page content. Make sure you are on an active webpage.', "error");
        return;
      }

      const pageContent = response.content; 
      console.log("Page content:", pageContent);

      const message = {
        action: "askAI",
        question: question,
        pageContent: pageContent 
      };

      chrome.runtime.sendMessage(message, (aiResponse) => {
        if (chrome.runtime.lastError) {
          console.error("Error getting AI response:", chrome.runtime.lastError);
          displayMessage('Error: Unable to get AI response. Please check your API key and try again.', "error");
        } else if (aiResponse.error) {
          displayMessage('AI Error: ' + aiResponse.error, "error");
        } else if (aiResponse.answer) {
          displayMessage('AI Response: ' + aiResponse.answer, "success");
        } else {
          displayMessage('Unexpected response from AI. Please try again.', "error");
        }
      });
    });
  });
}

function displayMessage(message, type) {
  const resultElement = document.getElementById('result');
  resultElement.textContent = message;
  resultElement.className = type; // You can add CSS classes for different message types (error, success, info)
}
