import { GoogleGenAI } from '@google/genai';

export async function lookupPart(query: string, language: 'ar' | 'en' = 'ar') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    const err = new Error('GEMINI_API_KEY is not configured on the server');
    (err as Error & { status: number }).status = 503;
    throw err;
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt =
    language === 'ar'
      ? `أنت مساعد خبير في قطع غيار السيارات للسوق الخليجي. أجب بالعربية باختصار ومنظم.
استعلام المستخدم: ${query}

أرجع JSON فقط بهذا الشكل:
{"partName":"","partNumber":"","oemHints":[],"brand":"","category":"","compatibleVehicles":[{"make":"","model":"","years":""}],"notes":""}`
      : `You are an automotive spare parts expert for Middle East retail. Reply with JSON only.
User query: ${query}

Return exactly:
{"partName":"","partNumber":"","oemHints":[],"brand":"","category":"","compatibleVehicles":[{"make":"","model":"","years":""}],"notes":""}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const text = response.text?.trim() || '{}';
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}
