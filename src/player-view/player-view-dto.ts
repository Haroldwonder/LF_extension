import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { ThemePreference, FontSize, NavigationStyle } from './player-view.entity';

export class CreatePlayerViewDto {
  @ApiProperty({ description: 'The user ID this view belongs to' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ 
    enum: ThemePreference, 
    default: ThemePreference.SYSTEM,
    description: 'User theme preference' 
  })
  @IsEnum(ThemePreference)
  @IsOptional()
  themePreference?: ThemePreference;

  @ApiProperty({ 
    enum: FontSize, 
    default: FontSize.MEDIUM,
    description: 'Font size preference' 
  })
  @IsEnum(FontSize)
  @IsOptional()
  fontSize?: FontSize;

  @ApiProperty({ 
    enum: NavigationStyle, 
    default: NavigationStyle.STANDARD,
    description: 'Navigation style preference' 
  })
  @IsEnum(NavigationStyle)
  @IsOptional()
  navigationStyle?: NavigationStyle;

  @ApiProperty({ 
    default: true,
    description: 'Whether to enable notifications' 
  })
  @IsBoolean()
  @IsOptional()
  enableNotifications?: boolean;

  @ApiProperty({ 
    default: false,
    description: 'Whether to enable high contrast mode for accessibility' 
  })
  @IsBoolean()
  @IsOptional()
  highContrastMode?: boolean;

  @ApiProperty({ 
    default: false,
    description: 'Whether to reduce motion effects for accessibility' 
  })
  @IsBoolean()
  @IsOptional()
  reduceMotion?: boolean;

  @ApiProperty({ 
    default: true,
    description: 'Whether to enable haptic feedback' 
  })
  @IsBoolean()
  @IsOptional()
  enableHapticFeedback?: boolean;

  @ApiProperty({ 
    default: true,
    description: 'Whether to show real-time status indicators' 
  })
  @IsBoolean()
  @IsOptional()
  showRealTimeStatus?: boolean;

  @ApiProperty({ 
    default: 'en',
    description: 'Language preference' 
  })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({ 
    description: 'Custom layout configuration',
    default: {} 
  })
  @IsObject()
  @IsOptional()
  customLayout?: Record<string, any>;

  @ApiProperty({ 
    description: 'List of quick actions to show in the interface',
    default: [] 
  })
  @IsArray()
  @IsOptional()
  quickActions?: string[];

  @ApiProperty({ 
    description: 'Last screen orientation (in degrees)',
    default: 0 
  })
  @IsOptional()
  lastScreenOrientation?: number;
}

export class UpdatePlayerViewDto {
  @ApiProperty({ 
    enum: ThemePreference,
    required: false,
    description: 'User theme preference' 
  })
  @IsEnum(ThemePreference)
  @IsOptional()
  themePreference?: ThemePreference;

  @ApiProperty({ 
    enum: FontSize,
    required: false,
    description: 'Font size preference' 
  })
  @IsEnum(FontSize)
  @IsOptional()
  fontSize?: FontSize;

  @ApiProperty({ 
    enum: NavigationStyle,
    required: false,
    description: 'Navigation style preference' 
  })
  @IsEnum(NavigationStyle)
  @IsOptional()
  navigationStyle?: NavigationStyle;

  @ApiProperty({ 
    required: false,
    description: 'Whether to enable notifications' 
  })
  @IsBoolean()
  @IsOptional()
  enableNotifications?: boolean;

  @ApiProperty({ 
    required: false,
    description: 'Whether to enable high contrast mode for accessibility' 
  })
  @IsBoolean()
  @IsOptional()
  highContrastMode?: boolean;

  @ApiProperty({ 
    required: false,
    description: 'Whether to reduce motion effects for accessibility' 
  })
  @IsBoolean()
  @IsOptional()
  reduceMotion?: boolean;

  @ApiProperty({ 
    required: false,
    description: 'Whether to enable haptic feedback' 
  })
  @IsBoolean()
  @IsOptional()
  enableHapticFeedback?: boolean;

  @ApiProperty({ 
    required: false,
    description: 'Whether to show real-time status indicators' 
  })
  @IsBoolean()
  @IsOptional()
  showRealTimeStatus?: boolean;

  @ApiProperty({ 
    required: false,
    description: 'Language preference' 
  })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({ 
    required: false,
    description: 'Custom layout configuration' 
  })
  @IsObject()
  @IsOptional()
  customLayout?: Record<string, any>;

  @ApiProperty({ 
    required: false,
    description: 'List of quick actions to show in the interface' 
  })
  @IsArray()
  @IsOptional()
  quickActions?: string[];

  @ApiProperty({ 
    required: false,
    description: 'Last screen orientation (in degrees)' 
  })
  @IsOptional()
  lastScreenOrientation?: number;
}

export class PlayerViewResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: ThemePreference })
  themePreference: ThemePreference;

  @ApiProperty({ enum: FontSize })
  fontSize: FontSize;

  @ApiProperty({ enum: NavigationStyle })
  navigationStyle: NavigationStyle;

  @ApiProperty()
  enableNotifications: boolean;

  @ApiProperty()
  highContrastMode: boolean;

  @ApiProperty()
  reduceMotion: boolean;

  @ApiProperty()
  enableHapticFeedback: boolean;

  @ApiProperty()
  showRealTimeStatus: boolean;

  @ApiProperty()
  language: string;

  @ApiProperty()
  customLayout: Record<string, any>;

  @ApiProperty()
  quickActions: string[];

  @ApiProperty()
  lastScreenOrientation: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
