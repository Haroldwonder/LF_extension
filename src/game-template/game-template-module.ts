import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameTemplateService } from './game-template.service';
import { GameTemplateController } from './game-template.controller';
import { GameTemplate } from './game-template.entity';
import { GameTemplateVersion } from './game-template-version.entity';
import { Category } from '../category/category.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GameTemplate, 
      GameTemplateVersion, 
      Category, 
      User
    ])
  ],
  controllers: [GameTemplateController],
  providers: [GameTemplateService],
  exports: [GameTemplateService]
})
export class GameTemplateModule {}
