import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsEnum, 
  IsArray, 
  IsOptional, 
  IsUUID, 
  IsBoolean,
  IsNotEmpty,
  IsObject,
  Min,
  Max,
  IsInt
} from 'class-validator';
import { Type } from 'class-transformer';
import { GameDifficulty, TemplateStatus } from './game-template.entity';

export class CreateGameTemplateDto {
  @ApiProperty({ description: 'The title of the game template' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'A description of the game template', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'The difficulty level of the game',
    enum: GameDifficulty,
    default: GameDifficulty.INTERMEDIATE
  })
  @IsEnum(GameDifficulty)
  @IsOptional()
  difficulty?: GameDifficulty;

  @ApiProperty({ 
    description: 'Game genres',
    type: [String],
    example: ['strategy', 'trivia', 'educational']
  })
  @IsArray()
  @IsString({ each: true })
  genres: string[];

  @ApiProperty({ 
    description: 'Historical eras or time periods',
    type: [String],
    required: false,
    example: ['ancient', 'medieval', 'modern']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  era?: string[];

  @ApiProperty({ 
    description: 'Initial configuration for the template',
    type: Object
  })
  @IsObject()
  configuration: object;

  @ApiProperty({ 
    description: 'Determines if the template is publicly visible',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class UpdateGameTemplateDto {
  @ApiProperty({ description: 'The title of the game template', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'A description of the game template', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'The difficulty level of the game',
    enum: GameDifficulty,
    required: false
  })
  @IsEnum(GameDifficulty)
  @IsOptional()
  difficulty?: GameDifficulty;

  @ApiProperty({ 
    description: 'Game genres',
    type: [String],
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  genres?: string[];

  @ApiProperty({ 
    description: 'Historical eras or time periods',
    type: [String],
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  era?: string[];

  @ApiProperty({ 
    description: 'Template status',
    enum: TemplateStatus,
    required: false
  })
  @IsEnum(TemplateStatus)
  @IsOptional()
  status?: TemplateStatus;

  @ApiProperty({ 
    description: 'Determines if the template is publicly visible',
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class GameTemplateResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: GameDifficulty })
  difficulty: GameDifficulty;

  @ApiProperty({ type: [String] })
  genres: string[];

  @ApiProperty({ type: [String] })
  era: string[];

  @ApiProperty({ enum: TemplateStatus })
  status: TemplateStatus;

  @ApiProperty()
  isPublic: boolean;

  @ApiProperty()
  playCount: number;

  @ApiProperty()
  averageRating: number;

  @ApiProperty()
  ratingCount: number;

  @ApiProperty()
  creatorId: string;

  @ApiProperty()
  currentVersionId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateGameTemplateVersionDto {
  @ApiProperty({ description: 'The ID of the template to create a version for' })
  @IsUUID()
  @IsNotEmpty()
  templateId: string;

  @ApiProperty({ description: 'Version name (optional)', required: false })
  @IsString()
  @IsOptional()
  versionName?: string;

  @ApiProperty({ description: 'Notes about changes in this version', required: false })
  @IsString()
  @IsOptional()
  changeNotes?: string;

  @ApiProperty({ description: 'The configuration for this version' })
  @IsObject()
  configuration: object;
}

export class RateGameTemplateDto {
  @ApiProperty({ description: 'Rating value (1-5)' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Optional review comment', required: false })
  @IsString()
  @IsOptional()
  comment?: string;
}

export class GameTemplateFilterDto {
  @ApiProperty({ description: 'Filter by difficulty', enum: GameDifficulty, required: false })
  @IsEnum(GameDifficulty)
  @IsOptional()
  difficulty?: GameDifficulty;

  @ApiProperty({ description: 'Filter by genre', required: false })
  @IsString()
  @IsOptional()
  genre?: string;

  @ApiProperty({ description: 'Filter by era', required: false })
  @IsString()
  @IsOptional()
  era?: string;

  @ApiProperty({ description: 'Filter by creator ID', required: false })
  @IsUUID()
  @IsOptional()
  creatorId?: string;

  @ApiProperty({ description: 'Sort by popularity', required: false, default: false })
  @IsBoolean()
  @IsOptional()
  popular?: boolean;

  @ApiProperty({ description: 'Sort by highest rating', required: false, default: false })
  @IsBoolean()
  @IsOptional()
  topRated?: boolean;

  @ApiProperty({ description: 'Search term for title/description', required: false })
  @IsString()
  @IsOptional()
  search?: string;
}
