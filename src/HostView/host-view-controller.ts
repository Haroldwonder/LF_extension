// src/host-view/controllers/host-view.controller.ts
import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { HostViewService } from '../services/host-view.service';
import { HostAuthGuard } from '../../auth/guards/host-auth.guard';
import { DisplaySettings } from '../schemas/host-view.schema';
import { CreateHostViewDto, UpdateDisplaySettingsDto } from '../dto/host-view.dto';

@Controller('host-view')
@UseGuards(HostAuthGuard)
export class HostViewController {
  constructor(private readonly hostViewService: HostViewService) {}

  @Post(':gameId')
  async createHostView(
    @Param('gameId') gameId: string,
    @Body() createHostViewDto: CreateHostViewDto,
  ) {
    return this.hostViewService.create(gameId, createHostViewDto.hostId);
  }

  @Get(':gameId')
  async getHostView(@Param('gameId') gameId: string) {
    return this.hostViewService.findByGameId(gameId);
  }

  @Put(':gameId/display-settings')
  async updateDisplaySettings(
    @Param('gameId') gameId: string,
    @Body() displaySettings: UpdateDisplaySettingsDto,
  ) {
    return this.hostViewService.updateDisplaySettings(gameId, displaySettings);
  }

  @Get(':gameId/players')
  async getPlayerList(@Param('gameId') gameId: string) {
    return this.hostViewService.getPlayerListWithStatus(gameId);
  }
}
