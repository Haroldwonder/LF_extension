// src/statistics/entities/user-statistics.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';

interface GameStatistics {
  gameName: string;
  gameMode: string;
  sessionsPlayed: number;
  bestScore: number;
  averageScore: number;
  bestAccuracy: number;
  averageAccuracy: number;
  totalTime: number;
  averageTime: number;
  lastPlayed: Date;
  categoryPerformance?: Array<{
    category: string;
    accuracy: number;
    questionsAnswered: number;
  }>;
  difficultyPerformance?: {
    easy: {
      accuracy: number;
      questionsAnswered: number;
    };
    medium: {
      accuracy: number;
      questionsAnswered: number;
    };
    hard: {
      accuracy: number;
      questionsAnswered: number;
    };
  };
  metadata?: Record<string, any>;
}

interface Achievement {
  achievementId: string;
  dateEarned: Date;
  metadata?: Record<string, any>;
}

@Entity('user_statistics')
export class UserStatistics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  @Index()
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: 0 })
  totalSessions: number;

  @Column({ default: 0 })
  totalTimePlayed: number; // in seconds

  @Column({ default: 0 })
  totalQuestionsAnswered: number;

  @Column({ default: 0 })
  totalCorrectAnswers: number;

  @Column({ type: 'float', default: 0 })
  averageAccuracy: number;

  @Column({ type: 'json' })
  gameStatistics: GameStatistics[];

  @Column({ type: 'json' })
  timeDistribution: {
    mornings: number;    // 5am - 12pm
    afternoons: number;  // 12pm - 5pm
    evenings: number;    // 5pm - 10pm
    nights: number;      // 10pm - 5am
  };

  @Column({ type: 'json' })
  weekdayDistribution: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };

  @Column({ type: 'json' })
  progressMetrics: {
    longestStreak: number;  // consecutive days played
    currentStreak: number;
    lastActiveDate?: Date;
    improvementRate: number; // calculated improvement over time
  };

  @Column({ type: 'json', nullable: true })
  achievements: Achievement[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
