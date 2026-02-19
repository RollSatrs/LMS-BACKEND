import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateTestQuestionDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  text?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
