import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoundResult } from './round-result.entity';
import { CreateRoundResultDto, UpdateRoundResultDto } from './round-result.dto';
import { RoundService } from '../round/round.service';

@Injectable()
export class RoundResultService {
  constructor(
    @InjectRepository(RoundResult)
    private roundResultRepository: Repository<RoundResult>,
    private roundService: RoundService,
  ) {}

  async create(createRoundResultDto: CreateRoundResultDto): Promise<RoundResult> {
    // Verify the round exists
    const round = await this.roundService.findOne(createRoundResultDto.roundId);
    if (!round) {
      throw new NotFoundException(`Round with ID ${createRoundResultDto.roundId} not found`);
    }

    // Calculate performance statistics if not provided
    if (!createRoundResultDto.performanceStats) {
      createRoundResultDto.performanceStats = await this.calculatePerformanceStats(createRoundResultDto.roundId);
    }

    const roundResult = this.roundResultRepository.create(createRoundResultDto);
    return this.roundResultRepository.save(roundResult);
  }

  async findAll(): Promise<RoundResult[]> {
    return this.roundResultRepository.find();
  }

  async findOne(id: string): Promise<RoundResult> {
    const roundResult = await this.roundResultRepository.findOne({ where: { id } });
    if (!roundResult) {
      throw new NotFoundException(`Round result with ID ${id} not found`);
    }
    return roundResult;
  }

  async findByRoundId(roundId: string): Promise<RoundResult> {
    const roundResult = await this.roundResultRepository.findOne({ where: { roundId } });
    if (!roundResult) {
      throw new NotFoundException(`Round result for round ID ${roundId} not found`);
    }
    return roundResult;
  }

  async update(id: string, updateRoundResultDto: UpdateRoundResultDto): Promise<RoundResult> {
    const roundResult = await this.findOne(id);
    
    // Update the round result properties
    Object.assign(roundResult, updateRoundResultDto);
    
    return this.roundResultRepository.save(roundResult);
  }

  async remove(id: string): Promise<void> {
    const result = await this.roundResultRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Round result with ID ${id} not found`);
    }
  }

  async revealResults(id: string): Promise<RoundResult> {
    const roundResult = await this.findOne(id);
    roundResult.isRevealed = true;
    return this.roundResultRepository.save(roundResult);
  }

  private async calculatePerformanceStats(roundId: string): Promise<any> {
    // This would typically fetch participant answers from a participant-answers service
    // and calculate the performance statistics
    // For now, we'll return mock data
    return {
      averageResponseTime: 5.2,
      fastestResponseTime: 1.8,
      slowestResponseTime: 15.6,
      correctAnswerPercentage: 68.5,
    };
  }
}
