import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatAiDto } from './dto/chat-ai.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("chat")
  async chat(@Body() dto: ChatAiDto){
    const answer = await this.aiService.chat(dto.message)
    return {answer}
  }
}
