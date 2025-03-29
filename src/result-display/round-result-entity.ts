import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Round } from '../round/round.entity';

// Interface representing the distribution of answers
export interface AnswerDistribution {
  answerId: string;
  answerText: string;
  count: number;
  percentage: number;
}

// Interface for performance statistics
export interface PerformanceStats {
  averageResponseTime: number;
  fastestResponseTime: number;
  slowestResponseTime: number;
  correctAnswerPercentage: number;
}

@Entity()
export class RoundResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Round, (round) => round.results)
  round: Round;

  @Column()
  roundId: string;

  @Column('json')
  answerDistribution: AnswerDistribution[];

  @Column()
  correctAnswerId: string;

  @Column('json')
  performanceStats: PerformanceStats;

  @Column({ default: false })
  isRevealed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
