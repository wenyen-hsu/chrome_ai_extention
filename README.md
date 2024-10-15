# Voice AI Agent with Gemini - User Guide

## Introduction

Voice AI Agent with Gemini is a Chrome extension that allows you to interact with an AI powered by Google's Gemini model. It can answer questions about the current webpage you're viewing using voice commands.

## Installation

1. git clone https://github.com/wenyen-hsu/chrome_ai_extention.git
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click on "Load unpacked" and select the unzipped extension folder.
5. The Voice AI Agent icon should now appear in your Chrome toolbar.

## Setting Up

1. Click on the Voice AI Agent icon in your Chrome toolbar to open the popup interface.
2. You will need to enter your Gemini API key. If you don't have one:
   - Visit the [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create or select a project
   - Generate an API key
3. Copy your API key and paste it into the "API Key" field in the extension popup.
4. Click "Save API Key" to store it securely.

## Using the Extension

1. Navigate to any webpage you want to ask questions about.
2. Click on the Voice AI Agent icon to open the popup.
3. Click the "Start Listening" button to activate voice recognition.
4. Speak your question clearly. The recognized text will appear in the text area.
5. If the recognition is correct, click "Analyze Text" to send your question to the AI.
6. Wait for the AI to process your question and provide an answer.
7. The answer will be displayed in the result area of the popup.

## Voice Commands

- To start listening: Click the "Start Listening" button
- To stop listening: Click the "Stop Listening" button (same button, it toggles)
- Speak clearly and concisely for best recognition results

## Text Input (ongoing)

If you prefer typing or if voice recognition is not working:
1. You can type your question directly into the text area.
2. Click "Analyze Text" to send your typed question to the AI.

## Troubleshooting

- If the microphone isn't working, make sure you've granted microphone permissions to the extension.
- If you receive an error about the API key, double-check that you've entered it correctly.
- If the AI doesn't respond, ensure you have a stable internet connection.
- For any persistent issues, try refreshing the page or restarting Chrome.
- If you encounter any problems with the extension, please check the GitHub repository for any known issues or updates.

## Privacy Note

This extension requires access to your current webpage content and microphone to function. Your API key and voice data are processed locally and only sent to Google's servers for AI processing. Please review Google's privacy policy for information on how they handle data sent to their AI models.

## Support and Contributing

- If you encounter any issues or have questions, please open an issue on the GitHub repository.
- Contributions to the project are welcome. Please see the CONTRIBUTING.md file in the repository for guidelines.

## Staying Updated

- To get the latest version of the extension, periodically check the GitHub repository for updates.
- You can "Watch" the repository to receive notifications about new releases and important changes.

Enjoy using Voice AI Agent with Gemini to enhance your browsing experience with AI-powered voice interactions!
