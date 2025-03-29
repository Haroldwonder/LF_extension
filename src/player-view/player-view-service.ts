import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerView } from './player-view.entity';
import { CreatePlayerViewDto, UpdatePlayerViewDto } from './player-view.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class PlayerViewService {
  constructor(
    @InjectRepository(PlayerView)
    private playerViewRepository: Repository<PlayerView>,
    private userService: UserService
  ) {}

  async create(createPlayerViewDto: CreatePlayerViewDto): Promise<PlayerView> {
    // Check if user exists
    const user = await this.userService.findOne(createPlayerViewDto.userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${createPlayerViewDto.userId} not found`);
    }

    // Check if player view already exists for this user
    const existingView = await this.playerViewRepository.findOne({
      where: { userId: createPlayerViewDto.userId }
    });

    if (existingView) {
      // Update the existing view instead of creating a new one
      Object.assign(existingView, createPlayerViewDto);
      return this.playerViewRepository.save(existingView);
    }

    // Create new player view
    const playerView = this.playerViewRepository.create(createPlayerViewDto);
    return this.playerViewRepository.save(playerView);
  }

  async findAll(): Promise<PlayerView[]> {
    return this.playerViewRepository.find();
  }

  async findOne(id: string): Promise<PlayerView> {
    const playerView = await this.playerViewRepository.findOne({ where: { id } });
    if (!playerView) {
      throw new NotFoundException(`Player view with ID ${id} not found`);
    }
    return playerView;
  }

  async findByUserId(userId: string): Promise<PlayerView> {
    const playerView = await this.playerViewRepository.findOne({ where: { userId } });
    if (!playerView) {
      throw new NotFoundException(`Player view for user ID ${userId} not found`);
    }
    return playerView;
  }

  async update(id: string, updatePlayerViewDto: UpdatePlayerViewDto): Promise<PlayerView> {
    const playerView = await this.findOne(id);
    
    // Update the player view properties
    Object.assign(playerView, updatePlayerViewDto);
    
    return this.playerViewRepository.save(playerView);
  }

  async updateByUserId(
    userId: string, 
    updatePlayerViewDto: UpdatePlayerViewDto
  ): Promise<PlayerView> {
    const playerView = await this.findByUserId(userId);
    
    // Update the player view properties
    Object.assign(playerView, updatePlayerViewDto);
    
    return this.playerViewRepository.save(playerView);
  }

  async remove(id: string): Promise<void> {
    const result = await this.playerViewRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Player view with ID ${id} not found`);
    }
  }

  async getDefaultSettings(): Promise<Partial<PlayerView>> {
    // Return default settings that can be used as a starting point
    return {
      themePreference: 'system',
      fontSize: 'medium',
      navigationStyle: 'standard',
      enableNotifications: true,
      highContrastMode: false,
      reduceMotion: false,
      enableHapticFeedback: true,
      showRealTimeStatus: true,
      language: 'en',
      customLayout: {},
      quickActions: [
        'join_game',
        'answer_question',
        'view_results',
        'exit_game'
      ]
    };
  }

  async getAccessibilityPresets(): Promise<Record<string, Partial<PlayerView>>> {
    // Return predefined accessibility presets
    return {
      visuallyImpaired: {
        fontSize: 'extra-large',
        highContrastMode: true,
        enableHapticFeedback: true,
        reduceMotion: true,
        navigationStyle: 'standard'
      },
      hearingImpaired: {
        enableNotifications: true,
        showRealTimeStatus: true,
        enableHapticFeedback: true
      },
      motorImpaired: {
        navigationStyle: 'gesture',
        fontSize: 'large',
        customLayout: {
          buttonSpacing: 'large',
          touchTargetSize: 'large'
        }
      },
      cognitiveImpaired: {
        navigationStyle: 'compact',
        reduceMotion: true,
        customLayout: {
          simplifiedUI: true,
          reducedOptions: true
        }
      }
    };
  }

  async detectOptimalSettings(userAgent: string): Promise<Partial<UpdatePlayerViewDto>> {
    // This method would analyze the user agent to determine the best default settings
    // For example, detect if it's a mobile device, tablet, or desktop
    const isMobile = /mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
    
    if (isMobile) {
      return {
        navigationStyle: 'compact',
        fontSize: 'medium',
        customLayout: {
          isCompactLayout: true,
          showBottomNav: true,
          buttonSize: 'large'
        }
      };
    } else if (isTablet) {
      return {
        navigationStyle: 'standard',
        fontSize: 'medium',
        customLayout: {
          isCompactLayout: false,
          useTabletLayout: true,
          showSidebar: true
        }
      };
    } else {
      return {
        navigationStyle: 'standard',
        fontSize: 'medium',
        customLayout: {
          isCompactLayout: false,
          showSidebar: true,
          useAdvancedFeatures: true
        }
      };
    }
  }
}
