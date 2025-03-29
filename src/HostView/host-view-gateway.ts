// src/host-view/gateways/host-view.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsHostAuthGuard } from '../../auth/guards/ws-host-auth.guard';
import { HostViewService } from '../services/host-view.service';

@WebSocketGateway({
  namespace: 'host-view',
  cors: true,
})
@UseGuards(WsHostAuthGuard)
export class HostViewGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly hostViewService: HostViewService) {}

  @SubscribeMessage('join-host-room')
  async handleJoinRoom(
    @MessageBody() data: { gameId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { gameId } = data;
    await client.join(`game:${gameId}:host`);
    return { success: true };
  }

  @SubscribeMessage('update-display-settings')
  async handleUpdateDisplaySettings(
    @MessageBody() data: { gameId: string; displaySettings: any },
    @ConnectedSocket() client: Socket,
  ) {
    const { gameId, displaySettings } = data;
    const updated = await this.hostViewService.updateDisplaySettings(
      gameId,
      displaySettings,
    );
    
    // Broadcast the updated settings to all clients in the host room
    this.server.to(`game:${gameId}:host`).emit('display-settings-updated', updated.displaySettings);
    
    return { success: true };
  }

  @SubscribeMessage('start-challenge')
  async handleStartChallenge(
    @MessageBody() data: { gameId: string; challengeId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { gameId, challengeId } = data;
    // In a real implementation, you'd call your game service to start the challenge
    
    // Broadcast to all players that the challenge has started
    this.server.to(`game:${gameId}`).emit('challenge-started', { challengeId });
    
    return { success: true };
  }

  @SubscribeMessage('end-challenge')
  async handleEndChallenge(
    @MessageBody() data: { gameId: string; challengeId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { gameId, challengeId } = data;
    // In a real implementation, you'd call your game service to end the challenge
    
    // Broadcast to all players that the challenge has ended
    this.server.to(`game:${gameId}`).emit('challenge-ended', { challengeId });
    
    return { success: true };
  }

  @SubscribeMessage('reveal-answer')
  async handleRevealAnswer(
    @MessageBody() data: { gameId: string; challengeId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { gameId, challengeId } = data;
    // In a real implementation, you'd call your game service to reveal the answer
    
    // Broadcast to all players that the answer has been revealed
    this.server.to(`game:${gameId}`).emit('answer-revealed', { challengeId });
    
    return { success: true };
  }
}
