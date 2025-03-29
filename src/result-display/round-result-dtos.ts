import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsObject, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AnswerDistribution, PerformanceStats } from './round-result.entity';

export class AnswerDistributionDto implements AnswerDistribution {
  @ApiProperty({ description: 'The ID of the answer' })
  @IsString()
  @IsNotEmpty()
  answerId: string;

  @ApiProperty({ description: 'The text of the answer' })
  @IsString()
  @IsNotEmpty()
  answerText: string;

  @ApiProperty({ description: 'The number of participants who selected this answer' })
  @IsNumber()
  count: number;

  @ApiProperty({ description: 'The percentage of participants who selected this answer' })
  @IsNumber()
  percentage: number;
}

export class PerformanceStatsDto implements PerformanceStats {
  @ApiProperty({ description: 'Average response time in seconds' })
  @IsNumber()
  averageResponseTime: number;

  @ApiProperty({ description: 'Fastest response time in seconds' })
  @IsNumber()
  fastestResponseTime: number;

  @ApiProperty({ description: 'Slowest response time in seconds' })
  @IsNumber()
  slowestResponseTime: number;

  @ApiProperty({ description: 'Percentage of participants who selected the correct answer' })
  @IsNumber()
  correctAnswerPercentage: number;
}

export class CreateRoundResultDto {
  @ApiProperty({ description: 'The ID of the associated round' })
  @IsUUID()
  @IsNotEmpty()
  roundId: string;

  @ApiProperty({ description: 'Distribution of answers', type: [AnswerDistributionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDistributionDto)
  answerDistribution: AnswerDistributionDto[];

  @ApiProperty({ description: 'The ID of the correct answer' })
  @IsString()
  @IsNotEmpty()
  correctAnswerId: string;

  @ApiProperty({ description: 'Performance statistics', type: PerformanceStatsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => PerformanceStatsDto)
  performanceStats: PerformanceStatsDto;

  @ApiProperty({ description: 'Whether the results have been revealed to participants', default: false })
  @IsBoolean()
  isRevealed: boolean;
}

export class UpdateRoundResultDto {
  @ApiProperty({ description: 'Whether the results have been revealed to participants' })
  @IsBoolean()
  isRevealed?: boolean;
}

export class RoundResultResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  roundId: string;

  @ApiProperty({ type: [AnswerDistributionDto] })
  answerDistribution: AnswerDistributionDto[];

  @ApiProperty()
  correctAnswerId: string;

  @ApiProperty({ type: PerformanceStatsDto })
  performanceStats: PerformanceStatsDto;

  @ApiProperty()
  isRevealed: boolean;

  @ApiProperty()
  createdAt: Date;
}
