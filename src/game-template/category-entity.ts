import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum CategoryType {
  GENRE = 'genre',
  DIFFICULTY = 'difficulty',
  ERA = 'era',
  THEME = 'theme',
  SUBJECT = 'subject'
}

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: CategoryType,
    default: CategoryType.THEME
  })
  type: CategoryType;

  @Column({ nullable: true })
  icon: string;

  @Column({ default: 0 })
  templateCount: number;
}
