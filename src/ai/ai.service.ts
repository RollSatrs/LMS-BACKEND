import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
    private openai: OpenAI | null = null;

    constructor() {
        const apiKey = process.env.OPENAI_API;
        if (apiKey) {
            this.openai = new OpenAI({ apiKey });
        }
    }

    async chat(message: string): Promise<string> {
        if (!this.openai) {
            return 'AI не настроен: задайте OPENAI_API в переменных окружения.';
        }
        try {
            const response = await this.openai.chat.completions.create({
                model: "chatgpt-4o-latest",
                messages: [
                    {role: 'user', content: message}
                ]
            })
            return response.choices[0].message.content!;    

        }catch(err){
            console.log(err)
            return "error"
        }
    }
}
