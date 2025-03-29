import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  OneToMany, 
  JoinColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { User } from '../user/user.entity';
import { GameTemplateVersion } from './game-template-version.entity';
import { GameTemplateRating } from './game-template-rating.entity';

export enum GameDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum TemplateStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

@Entity()
export class GameTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ 
    type: 'enum',
    enum: GameDifficulty,
    default: GameDifficulty.INTERMEDIATE
  })
  difficulty: GameDifficulty;
  
  @Column('simple-array')
  genres: string[];
  
  @Column('simple-array', { nullable: true })
  era: string[];
  
  @Column({ 
    type: 'enum', 
    enum: TemplateStatus, 
    default: TemplateStatus.DRAFT 
  })
  status: TemplateStatus;
  
  @Column({ default: false })
  isPublic: boolean;
  
  @Column({ default: 0 })
  playCount: number;
  
  @Column({ default: 0 })
  averageRating: number;
  
  @Column({ default: 0 })
  ratingCount: number;
  
  @ManyToOne(() => User)
  @JoinColumn()
  creator: User;
  
  @Column()
  creatorId: string;
  
  @OneToMany(() => GameTemplateVersion, version => version.template)
  versions: GameTemplateVersion[];
  
  @Column()
  currentVersionId: string;
  
  @OneToMany(() => GameTemplateRating, rating => rating.template)
  ratings: GameTemplateRating[];
  
  @ManyToMany(() => User)
  @JoinTable()
  favoriteByUsers: User[];
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
}
