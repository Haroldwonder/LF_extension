import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoundResultController } from './round-result.controller';
import { RoundResultService } from './round-result.service';
import { RoundResult } from './round-result.entity';
import { RoundModule } from '../round/round.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoundResult]),
    RoundModule, // Import RoundModule to use RoundService
  ],
  controllers: [RoundResultController],
  providers: [RoundResultService],
  exports: [RoundResultService],
})
export class RoundResultModule {}
