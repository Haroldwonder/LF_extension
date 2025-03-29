import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GameTemplate } from '../game-template/game-template.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => GameTemplate, template => template.creator)
  createdTemplates: GameTemplate[];

  // Other user properties and relationships...
}
