// src/host-view/services/host-view.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HostView, HostViewDocument } from '../schemas/host-view.schema';

@Injectable()
export class HostViewService {
  constructor(
    @InjectModel(HostView.name) private hostViewModel: Model<HostViewDocument>,
  ) {}

  async create(gameId: string, hostId: string): Promise<HostView> {
    const hostView = new this.hostViewModel({
      gameId,
      hostId,
      isActive: true,
    });
    return hostView.save();
  }

  async findByGameId(gameId: string): Promise<HostView> {
    return this.hostViewModel.findOne({ gameId }).exec();
  }

  async updateDisplaySettings(
    gameId: string,
    displaySettings: Partial<HostView['displaySettings']>,
  ): Promise<HostView> {
    return this.hostViewModel
      .findOneAndUpdate(
        { gameId },
        { $set: { displaySettings, updatedAt: new Date() } },
        { new: true },
      )
      .exec();
  }

  async getPlayerListWithStatus(gameId: string): Promise<any[]> {
    // This would typically integrate with your player service/model
    // Simplified implementation for demonstration
    const hostView = await this.findByGameId(gameId);
    if (!hostView) {
      return [];
    }
    
    // In a real implementation, you'd fetch this from your player database
    // and include connection status from your websocket manager
    return []; // Would return array of players with connection status
  }
}
