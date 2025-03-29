import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

export enum ThemePreference {
  SYSTEM = 'system',
  LIGHT = 'light',
  DARK = 'dark'
}

export enum FontSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  EXTRA_LARGE = 'extra-large'
}

export enum NavigationStyle {
  STANDARD = 'standard',
  COMPACT = 'compact',
  GESTURE = 'gesture'
}

@Entity()
export class PlayerView {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: ThemePreference,
    default: ThemePreference.SYSTEM
  })
  themePreference: ThemePreference;

  @Column({
    type: 'enum',
    enum: FontSize,
    default: FontSize.MEDIUM
  })
  fontSize: FontSize;

  @Column({
    type: 'enum',
    enum: NavigationStyle,
    default: NavigationStyle.STANDARD
  })
  navigationStyle: NavigationStyle;

  @Column({ default: true })
  enableNotifications: boolean;

  @Column({ default: false })
  highContrastMode: boolean;

  @Column({ default: false })
  reduceMotion: boolean;

  @Column({ default: true })
  enableHapticFeedback: boolean;

  @Column({ default: true })
  showRealTimeStatus: boolean;

  @Column({ default: 'en' })
  language: string;

  @Column('json', { default: {} })
  customLayout: Record<string, any>;

  @Column('json', { default: [] })
  quickActions: string[];

  @Column({ default: 0 })
  lastScreenOrientation: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
