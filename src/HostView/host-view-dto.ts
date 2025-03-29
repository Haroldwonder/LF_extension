// src/host-view/dto/host-view.dto.ts
import { IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateHostViewDto {
  @IsString()
  hostId: string;
}

export class UpdateDisplaySettingsDto {
  @IsNumber()
  @IsOptional()
  fontSize?: number;

  @IsBoolean()
  @IsOptional()
  showPlayerScores?: boolean;

  @IsBoolean()
  @IsOptional()
  showPlayerAnswers?: boolean;

  @IsBoolean()
  @IsOptional()
  showTimer?: boolean;
}
