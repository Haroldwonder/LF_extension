import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { GameTemplate } from './game-template.entity';

@Entity()
export class GameTemplateVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  versionNumber: number;
  
  @Column({ nullable: true })
  versionName: string;
  
  @Column({ type: 'text', nullable: true })
  changeNotes: string;
  
  @Column('json')
  configuration: object;
  
  @ManyToOne(() => GameTemplate, template => template.versions)
  @JoinColumn()
  template: GameTemplate;
  
  @Column()
  templateId: string;
  
  @CreateDateColumn()
  createdAt: Date;
}
