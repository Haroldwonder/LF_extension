// src/statistics/entities/session-statistics.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { GameSession } from '../../game-sessions/entities/game-session.entity';

@Entity('session_statistics')
export class SessionStatistics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id' })
  @Index()
  sessionId: string;

  @ManyToOne(() => GameSession, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: GameSession;

  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  @Index()
  gameName: string;

  @Column()
  @Index()
  gameMode: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column()
  duration: number; // in seconds

  @Column({ default: 0 })
  totalQuestions: number;

  @Column({ default: 0 })
  correctAnswers: number;

  @Column({ default: 0 })
  incorrectAnswers: number;

  @Column({ default: 0 })
  skippedQuestions: number;

  @Column({ type: 'float', default: 0 })
  accuracyRate: number;

  @Column({ type: 'float', default: 0 })
  score: number;

  @Column({ type: 'json' })
  difficultyBreakdown: {
    easy: {
      total: number;
      correct: number;
      avgResponseTime: number;
    };
    medium: {
      total: number;
      correct: number;
      avgResponseTime: number;
    };
    hard: {
      total: number;
      correct: number;
      avgResponseTime: number;
    };
  };

  @Column({ type: 'json' })
  categoryPerformance: Array<{
    category: string;
    total: number;
    correct: number;
    accuracy: number;
    avgResponseTime: number;
  }>;

  @Column({ type: 'json' })
  responseTimeDistribution: {
    lessThan3Seconds: number;
    threeToFiveSeconds: number;
    fiveToTenSeconds: number;
    tenToThirtySeconds: number;
    moreThanThirtySeconds: number;
  };

  @Column({ type: 'json' })
  responseTimeTrend: Array<{
    questionIndex: number;
    responseTime: number;
    isCorrect: boolean;
  }>;

  @Column({ type: 'json' })
  performanceTrend: Array<{
    questionsBatch: string;
    accuracy: number;
  }>;

  @Column({ type: 'json' })
  streaks: {
    maxCorrectStreak: number;
    maxIncorrectStreak: number;
    currentCorrectStreak: number;
  };

  @Column({ default: 'unknown' })
  device: string;

  @Column({ default: 'unknown' })
  platform: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'json' })
  comparisonMetrics: {
    accuracyDelta: number;
    timeDelta: number;
    scoreDelta: number;
    rank?: number;
    percentile?: number;
  };

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
