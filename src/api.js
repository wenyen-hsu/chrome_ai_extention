import {
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory
} from '../node_modules/@google/generative-ai/dist/index.mjs';

let genAI = null;
let model = null;

async function initModel(apiKey, generationConfig) {
    try {
        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_NONE
            }
        ];
        genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            safetySettings,
            generationConfig
        });
        return model;
    } catch (error) {
        console.error('Error initializing model:', error);
        throw new Error('Failed to initialize AI model');
    }
}

export async function runPrompt(apiKey, question, pageContent, generationConfig) {
    if (!apiKey) {
        throw new Error('API key is missing');
    }

    try {
        await initModel(apiKey, generationConfig);
        const prompt = `${pageContent}\n根据以上内容，回答问题：${question}`;
        console.log('Sending prompt:', prompt);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error running prompt:', error);
        if (error.message.includes('API key')) {
            throw new Error('Invalid API key');
        } else if (error.message.includes('network')) {
            throw new Error('Network error. Please check your internet connection.');
        } else {
            throw new Error('Unable to get AI response. Please try again later.');
        }
    }
}
