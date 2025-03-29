// src/host-view/host-view.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HostView, HostViewSchema } from './schemas/host-view.schema';
import { HostViewController } from './controllers/host-view.controller';
import { HostViewService } from './services/host-view.service';
import { HostViewGateway } from './gateways/host-view.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HostView.name, schema: HostViewSchema },
    ]),
  ],
  controllers: [HostViewController],
  providers: [HostViewService, HostViewGateway],
  exports: [HostViewService],
})
export class HostViewModule {}
