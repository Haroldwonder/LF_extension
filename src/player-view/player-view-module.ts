import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerViewService } from './player-view.service';
import { PlayerViewController } from './player-view.controller';
import { PlayerView } from './player-view.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlayerView]),
    UserModule, // Import UserModule to use UserService
  ],
  controllers: [PlayerViewController],
  providers: [PlayerViewService],
  exports: [PlayerViewService]
})
export class PlayerViewModule {}
