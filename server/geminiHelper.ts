import { GoogleGenAI } from '@google/genai';

/**
 * Wrapper for Gemini generateContent with automatic retry on 503 / 429 / UNAVAILABLE errors
 * and model cascade fallback.
 */
export async function generateContentWithRetry(
  ai: GoogleGenAI,
  params: {
    model: string;
    contents: any;
    config?: any;
  },
  maxRetries = 2,
  delayMs = 600
): Promise<any> {
  // Model fallback chain if primary model experiences high demand (503)
  const modelsToTry = Array.from(
    new Set([
      params.model || 'gemini-3.6-flash',
      'gemini-2.5-flash',
      'gemini-1.5-flash',
    ])
  );

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...params,
          model: modelName,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err?.message || err);
        const isTransient =
          errMsg.includes('503') ||
          errMsg.includes('429') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('high demand') ||
          errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('overloaded');

        if (isTransient && attempt < maxRetries) {
          console.warn(
            `[Gemini API] Transient error on ${modelName} (attempt ${attempt}/${maxRetries}). Retrying in ${delayMs * attempt}ms...`
          );
          await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
        } else if (isTransient) {
          console.warn(`[Gemini API] Model ${modelName} unavailable. Falling back to alternative model in chain...`);
          break; // Break attempt loop to try next model in chain
        } else {
          throw err;
        }
      }
    }
  }

  throw lastError;
}
