import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  JoinColumn,
  Unique
} from 'typeorm';
import { User } from '../user/user.entity';
import { GameTemplate } from './game-template.entity';

@Entity()
@Unique(['userId', 'templateId'])
export class GameTemplateRating {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ type: 'int', min: 1, max: 5 })
  rating: number;
  
  @Column({ type: 'text', nullable: true })
  comment: string;
  
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
  
  @Column()
  userId: string;
  
  @ManyToOne(() => GameTemplate, template => template.ratings)
  @JoinColumn()
  template: GameTemplate;
  
  @Column()
  templateId: string;
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
}
