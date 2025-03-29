import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { GameTemplate, TemplateStatus } from './game-template.entity';
import { GameTemplateVersion } from './game-template-version.entity';
import { GameTemplateRating } from './game-template-rating.entity';
import { CreateGameTemplateDto, UpdateGameTemplateDto, CreateGameTemplateVersionDto, RateGameTemplateDto, GameTemplateFilterDto } from './game-template.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class GameTemplateService {
  constructor(
    @InjectRepository(GameTemplate)
    private templateRepository: Repository<GameTemplate>,
    
    @InjectRepository(GameTemplateVersion)
    private versionRepository: Repository<GameTemplateVersion>,
    
    @InjectRepository(GameTemplateRating)
    private ratingRepository: Repository<GameTemplateRating>,
    
    private userService: UserService,
  ) {}
  
  // TEMPLATE CRUD OPERATIONS
  
  async create(createDto: CreateGameTemplateDto, userId: string): Promise<GameTemplate> {
    const user = await this.userService.findById(userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Create a transaction to ensure both template and version are created
    const queryRunner = this.templateRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Create template
      const template = this.templateRepository.create({
        ...createDto,
        creatorId: userId,
      });
      
      // Save template first without currentVersionId
      const savedTemplate = await queryRunner.manager.save(template);
      
      // Create initial version (v1)
      const version = this.versionRepository.create({
        templateId: savedTemplate.id,
        versionNumber: 1,
        versionName: 'Initial version',
        configuration: createDto.configuration,
      });
      
      const savedVersion = await queryRunner.manager.save(version);
      
      // Update template with currentVersionId
      savedTemplate.currentVersionId = savedVersion.id;
      await queryRunner.manager.save(savedTemplate);
      
      await queryRunner.commitTransaction();
      
      return this.findOne(savedTemplate.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  
  async findAll(filterDto: GameTemplateFilterDto, userId?: string): Promise<GameTemplate[]> {
    const { difficulty, genre, era, creatorId, popular, topRated, search } = filterDto;
    
    // Start building our query
    const query: FindOptionsWhere<GameTemplate> = {};
    
    // If we have a userId, we can show their own private templates
    // Otherwise, only show public templates
    if (userId) {
      query.isPublic = true;
      // Add additional condition for user's own templates, which could be approached in the query builder
    } else {
      query.isPublic = true;
      query.status = TemplateStatus.PUBLISHED;
    }
    
    // Apply filters
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (genre) {
      // Note: This is a simplification; for proper array contains search,
      // you'd need to use QueryBuilder with where clause
      query.genres = Like(`%${genre}%`);
    }
    
    if (era) {
      // Same note as above for array contains search
      query.era = Like(`%${era}%`);
    }
    
    if (creatorId) {
      query.creatorId = creatorId;
    }
    
    // For search in title or description, need to use QueryBuilder
    let queryBuilder = this.templateRepository.createQueryBuilder('template')
      .where(query);
    
    if (search) {
      queryBuilder = queryBuilder
        .andWhere('(template.title LIKE :search OR template.description LIKE :search)', 
          { search: `%${search}%` });
    }
    
    // Add user's private templates if userId is provided
    if (userId) {
      queryBuilder = queryBuilder
        .andWhere('(template.isPublic = :isPublic OR template.creatorId = :userId)', 
          { isPublic: true, userId });
    }
    
    // Apply sorting
    if (popular) {
      queryBuilder = queryBuilder.orderBy('template.playCount', 'DESC');
    } else if (topRated) {
      queryBuilder = queryBuilder.orderBy('template.averageRating', 'DESC');
    } else {
      queryBuilder = queryBuilder.orderBy('template.createdAt', 'DESC');
    }
    
    return queryBuilder.getMany();
  }
  
  async findOne(id: string, userId?: string): Promise<GameTemplate> {
    const template = await this.templateRepository.findOne({
      where: { id },
      relations: ['versions']
    });
    
    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
    
    // Check access
    if (!template.isPublic && (!userId || template.creatorId !== userId)) {
      throw new ForbiddenException('You do not have access to this template');
    }
    
    return template;
  }
  
  async update(id: string, updateDto: UpdateGameTemplateDto, userId: string): Promise<GameTemplate> {
    const template = await this.findOne(id);
    
    // Check ownership
    if (template.creatorId !== userId) {
      throw new ForbiddenException('You do not have permission to update this template');
    }
    
    // Update the properties
    Object.assign(template, updateDto);
    
    return this.templateRepository.save(template);
  }
  
  async remove(id: string, userId: string): Promise<void> {
    const template = await this.findOne(id);
    
    // Check ownership
    if (template.creatorId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this template');
    }
    
    // Delete the template
    const result = await this.templateRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
  }
  
  // VERSION MANAGEMENT
  
  async createVersion(createDto: CreateGameTemplateVersionDto, userId: string): Promise<GameTemplateVersion> {
    const template = await this.findOne(createDto.templateId);
    
    // Check ownership
    if (template.creatorId !== userId) {
      throw new ForbiddenException('You do not have permission to create versions for this template');
    }
    
    // Get latest version number
    const latestVersion = await this.versionRepository.findOne({
      where: { templateId: template.id },
      order: { versionNumber: 'DESC' }
    });
    
    const newVersionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;
    
    // Create new version
    const version = this.versionRepository.create({
      ...createDto,
      versionNumber: newVersionNumber,
    });
    
    const savedVersion = await this.versionRepository.save(version);
    
    // Update template to point to new version
    template.currentVersionId = savedVersion.id;
    await this.templateRepository.save(template);
    
    return savedVersion;
  }
  
  async getVersions(templateId: string, userId?: string): Promise<GameTemplateVersion[]> {
    // Check if user has access to the template
    await this.findOne(templateId, userId);
    
    // Get all versions
    return this.versionRepository.find({
      where: { templateId },
      order: { versionNumber: 'DESC' }
    });
  }
  
  async getVersion(versionId: string, userId?: string): Promise<GameTemplateVersion> {
    const version = await this.versionRepository.findOne({
      where: { id: versionId },
      relations: ['template']
    });
    
    if (!version) {
      throw new NotFoundException(`Version with ID ${versionId} not found`);
    }
    
    // Check access to the template
    await this.findOne(version.templateId, userId);
    
    return version;
  }
  
  async setCurrentVersion(templateId: string, versionId: string, userId: string): Promise<GameTemplate> {
    const template = await this.findOne(templateId);
    
    // Check ownership
    if (template.creatorId !== userId) {
      throw new ForbiddenException('You do not have permission to update this template');
    }
    
    // Check if version exists and belongs to this template
    const version = await this.versionRepository.findOne({
      where: { 
        id: versionId,
        templateId
      }
    });
    
    if (!version) {
      throw new NotFoundException(`Version with ID ${versionId} not found for this template`);
    }
    
    // Update current version
    template.currentVersionId = versionId;
    return this.templateRepository.save(template);
  }
  
  // RATING FUNCTIONALITY
  
  async rateTemplate(templateId: string, rateDto: RateGameTemplateDto, userId: string): Promise<GameTemplateRating> {
    const template = await this.findOne(templateId);
    
    // Check if template is public
    if (!template.isPublic) {
      throw new BadRequestException('Cannot rate a private template');
    }
    
    // Check if user has already rated
    const existingRating = await this.ratingRepository.findOne({
      where: {
        templateId,
        userId
      }
    });
    
    // Start a transaction
    const queryRunner = this.templateRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      let rating: GameTemplateRating;
      
      if (existingRating) {
        // Update existing rating
        existingRating.rating = rateDto.rating;
        existingRating.comment = rateDto.comment;
        rating = await queryRunner.manager.save(existingRating);
      } else {
        // Create new rating
        rating = this.ratingRepository.create({
          templateId,
          userId,
          rating: rateDto.rating,
          comment: rateDto.comment
        });
        rating = await queryRunner.manager.save(rating);
      }
      
      // Recalculate average rating
      const ratings = await this.ratingRepository.find({
        where: { templateId }
      });
      
      const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
      const average = sum / ratings.length;
      
      // Update template
      template.averageRating = average;
      template.ratingCount = ratings.length;
      await queryRunner.manager.save(template);
      
      await queryRunner.commitTransaction();
      
      return rating;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  
  async getTemplateRatings(templateId: string): Promise<GameTemplateRating[]> {
    // Check if template exists and is public
    const template = await this.findOne(templateId);
    
    if (!template.isPublic) {
      throw new BadRequestException('Cannot view ratings for a private template');
    }
    
    return this.ratingRepository.find({
      where: { templateId },
      order: { createdAt: 'DESC' }
    });
  }
  
  // SHARING AND DISCOVERY
  
  async publishTemplate(templateId: string, userId: string): Promise<GameTemplate> {
    const template = await this.findOne(templateId, userId);
    
    // Check ownership
    if (template.creatorId !== userId) {
      throw new ForbiddenException('You do not have permission to publish this template');
    }
    
    // Set as published
    template.status = TemplateStatus.PUBLISHED;
    template.isPublic = true;
    
    return this.templateRepository.save(template);
  }
  
  async toggleFavorite(templateId: string, userId: string): Promise<boolean> {
    const template = await this.findOne(templateId);
    const user = await this.userService.findById(userId);
    
    // Check if template is public
    if (!template.isPublic) {
      throw new BadRequestException('Cannot favorite a private template');
    }
    
    // Check if user has already favorited
    const isFavorited = await this.templateRepository
      .createQueryBuilder('template')
      .innerJoin('template.favoriteByUsers', 'user')
      .where('template.id = :templateId', { templateId })
      .andWhere('user.id = :userId', { userId })
      .getCount() > 0;
    
    // Update favorites
    if (isFavorited) {
      // Remove from favorites
      await this.templateRepository
        .createQueryBuilder()
        .relation(GameTemplate, 'favoriteByUsers')
        .of(template)
        .remove(user);
      return false;
    } else {
      // Add to favorites
      await this.templateRepository
        .createQueryBuilder()
        .relation(GameTemplate, 'favoriteByUsers')
        .of(template)
        .add(user);
      return true;
    }
  }
  
  async incrementPlayCount(templateId: string): Promise<GameTemplate> {
    const template = await this.findOne(templateId);
    
    // Increment play count
    template.playCount += 1;
    
    return this.templateRepository.save(template);
  }
  
  async getFeaturedTemplates(): Promise<GameTemplate[]> {
    // Get popular and highly rated templates
    return this.templateRepository.find({
      where: { 
        isPublic: true,
        status: TemplateStatus.PUBLISHED
      },
      order: {
        averageRating: 'DESC',
        playCount: 'DESC'
      },
      take: 10
    });
  }
}
