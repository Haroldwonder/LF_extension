import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request, 
  HttpStatus,
  Headers,
  Query,
  BadRequestException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { PlayerViewService } from './player-view.service';
import { CreatePlayerViewDto, UpdatePlayerViewDto, PlayerViewResponseDto } from './player-view.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlayerView } from './player-view.entity';

@ApiTags('player-view')
@Controller('player-view')
export class PlayerViewController {
  constructor(private readonly playerViewService: PlayerViewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create or update a player view configuration' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'The player view has been successfully created.', 
    type: PlayerViewResponseDto 
  })
  async create(
    @Body() createPlayerViewDto: CreatePlayerViewDto,
    @Request() req
  ): Promise<PlayerView> {
    // Use the authenticated user's ID if not specified
    if (!createPlayerViewDto.userId) {
      createPlayerViewDto.userId = req.user.id;
    }
    
    // Ensure the user can only create/update their own player view
    if (req.user.id !== createPlayerViewDto.userId && !req.user.isAdmin) {
      throw new BadRequestException('You can only create a player view for your own account');
    }
    
    return this.playerViewService.create(createPlayerViewDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all player views (admin only)' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return all player views', 
    type: [PlayerViewResponseDto] 
  })
  async findAll(@Request() req): Promise<PlayerView[]> {
    // Only allow admins to view all player views
    if (!req.user.isAdmin) {
      throw new BadRequestException('Only admins can view all player views');
    }
    return this.playerViewService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current user\'s player view' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return the player view', 
    type: PlayerViewResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Player view not found' 
  })
  async findMyView(@Request() req): Promise<PlayerView> {
    try {
      return await this.playerViewService.findByUserId(req.user.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Create default view if not found
        const defaultView: CreatePlayerViewDto = {
          userId: req.user.id,
          ...await this.playerViewService.getDefaultSettings()
        };
        return this.playerViewService.create(defaultView);
      }
      throw error;
    }
  }

  @Get('defaults')
  @ApiOperation({ summary: 'Get default player view settings' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return default settings' 
  })
  async getDefaults(): Promise<Partial<PlayerView>> {
    return this.playerViewService.getDefaultSettings();
  }

  @Get('accessibility-presets')
  @ApiOperation({ summary: 'Get accessibility presets for player view' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return accessibility presets' 
  })
  async getAccessibilityPresets(): Promise<Record<string, Partial<PlayerView>>> {
    return this.playerViewService.getAccessibilityPresets();
  }

  @Get('detect-settings')
  @ApiOperation({ summary: 'Detect optimal player view settings based on user agent' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return detected settings' 
  })
  async detectSettings(@Headers('user-agent') userAgent: string): Promise<Partial<UpdatePlayerViewDto>> {
    return this.playerViewService.detectOptimalSettings(userAgent);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a player view by ID' })
  @ApiParam({ name: 'id', description: 'Player view ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return the player view', 
    type: PlayerViewResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Player view not found' 
  })
  async findOne(@Param('id') id: string, @Request() req): Promise<PlayerView> {
    const view = await this.playerViewService.findOne(id);
    
    // Ensure the user can only view their own player view
    if (req.user.id !== view.userId && !req.user.isAdmin) {
      throw new BadRequestException('You can only view your own player view');
    }
    
    return view;
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a player view by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return the player view', 
    type: PlayerViewResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Player view not found' 
  })
  async findByUserId(@Param('userId') userId: string, @Request() req): Promise<PlayerView> {
    // Ensure the user can only view their own player view
    if (req.user.id !== userId && !req.user.isAdmin) {
      throw new BadRequestException('You can only view your own player view');
    }
    
    return this.playerViewService.findByUserId(userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a player view' })
  @ApiParam({ name: 'id', description: 'Player view ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'The player view has been successfully updated.', 
    type: PlayerViewResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Player view not found' 
  })
  async update(
    @Param('id') id: string,
    @Body() updatePlayerViewDto: UpdatePlayerViewDto,
    @Request() req
  ): Promise<PlayerView> {
    const view = await this.playerViewService.findOne(id);
    
    // Ensure the user can only update their own player view
    if (req.user.id !== view.userId && !req.user.isAdmin) {
      throw new BadRequestException('You can only update your own player view');
    }
    
    return this.playerViewService.update(id, updatePlayerViewDto);
  }

  @Patch('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a player view by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'The player view has been successfully updated.', 
    type: PlayerViewResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Player view not found' 
  })
  async updateByUserId(
    @Param('userId') userId: string,
    @Body() updatePlayerViewDto: UpdatePlayerViewDto,
    @Request() req
  ): Promise<PlayerView> {
    // Ensure the user can only update their own player view
    if (req.user.id !== userId && !req.user.isAdmin) {
      throw new BadRequestException('You can only update your own player view');
    }
    
    return this.playerViewService.updateByUserId(userId, updatePlayerViewDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a player view' })
  @ApiParam({ name: 'id', description: 'Player view ID' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'The player view has been successfully deleted.' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Player view not found' 
  })
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    const view = await this.playerViewService.findOne(id);
    
    // Ensure the user can only delete their own player view
    if (req.user.id !== view.userId && !req.user.isAdmin) {
      throw new BadRequestException('You can only delete your own player view');
    }
    
    return this.playerViewService.remove(id);
  }
}
