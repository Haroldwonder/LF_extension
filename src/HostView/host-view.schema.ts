// src/host-view/schemas/host-view.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HostViewDocument = HostView & Document;

@Schema()
export class DisplaySettings {
  @Prop({ required: true, default: 16 })
  fontSize: number;

  @Prop({ required: true, default: true })
  showPlayerScores: boolean;

  @Prop({ required: true, default: true })
  showPlayerAnswers: boolean;

  @Prop({ required: true, default: true })
  showTimer: boolean;
}

@Schema()
export class HostView {
  @Prop({ required: true })
  gameId: string;

  @Prop({ required: true })
  hostId: string;

  @Prop({ type: DisplaySettings, default: () => ({}) })
  displaySettings: DisplaySettings;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const HostViewSchema = SchemaFactory.createForClass(HostView);
