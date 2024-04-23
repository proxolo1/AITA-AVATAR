import { Inject, Injectable } from '@angular/core';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { GeminiConfig } from '../config/gemini.config';
import { API_KEY_CONF } from '../config/api';
import { parts } from '../config/prompt/AITA';
import { from } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class GeminiService {

  constructor(snackBar: MatSnackBar) { }
  generateContentWithGeminiPro(
    message: string,
    history: { role: string; parts: string }[],
    geminiConfig: GeminiConfig
  ) {
    const MODEL_NAME = geminiConfig.model;
    const API_KEY = geminiConfig.apiKey || API_KEY_CONF;
    async function response() {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });

      const generationConfig = {
        temperature: geminiConfig.temperature,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      };

      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ];
        if (geminiConfig.bot.value === 'GEMINI') {
          const chat = model.startChat({
            generationConfig,
            safetySettings,
          });

          const result = await chat.sendMessage(message);
          const response = result.response;
          return response.text();
        } else {
          parts.push({ text: `input: ${message}` });
          const result: any = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,
            safetySettings,
          })
          const response = result.response;
          parts.push({ text: `output: ${response.text()}` });
          return response.text();
        }

    }

    return from(response());
  }
}
