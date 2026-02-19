import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitTestAnswerDto {
  @IsInt()
  questionId: number;

  @IsInt()
  answerId: number;
}

export class SubmitTestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmitTestAnswerDto)
  answers: SubmitTestAnswerDto[];
}
