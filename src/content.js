let recognition;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleListening") {
    if (request.state === "start") {
      startSpeechRecognition();
    } else if (request.state === "stop") {
      stopSpeechRecognition();
    }
  } else if (request.action === "getPageContent") {
    const pageContent = document.documentElement.outerHTML;
    sendResponse({ content: pageContent });
  }
});

function startSpeechRecognition() {
  if (!recognition) {
    if ('SpeechRecognition' in window) {
      recognition = new SpeechRecognition();
    } else if ('webkitSpeechRecognition' in window) {
      recognition = new webkitSpeechRecognition();
    } else {
      console.error('Web Speech API is not supported in this browser.');
      chrome.runtime.sendMessage({ action: "recognitionNotSupported" });
      return;
    }

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      console.log('Speech recognition started');
      chrome.runtime.sendMessage({ action: "recognitionStarted" });
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      chrome.runtime.sendMessage({
        action: "recognitionResult",
        text: finalTranscript + interimTranscript
      });
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      chrome.runtime.sendMessage({
        action: "recognitionError",
        error: event.error
      });
    };

    recognition.onend = () => {
      console.log('Speech recognition stopped');
      chrome.runtime.sendMessage({ action: "recognitionStopped" });
    };
  }

  try {
    recognition.start();
  } catch (error) {
    console.error("Microphone error:", error);
    chrome.runtime.sendMessage({
      action: "microphoneError",
      error: error.message
    });
  }
}

function stopSpeechRecognition() {
  if (recognition) {
    recognition.stop();
    recognition = null; // Reset recognition after stopping
  }
}
