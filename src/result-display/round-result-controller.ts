import { Controller, Get, Post, Body, Param, Patch, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RoundResultService } from './round-result.service';
import { CreateRoundResultDto, UpdateRoundResultDto, RoundResultResponseDto } from './round-result.dto';
import { RoundResult } from './round-result.entity';

@ApiTags('round-results')
@Controller('round-results')
export class RoundResultController {
  constructor(private readonly roundResultService: RoundResultService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new round result' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The round result has been successfully created.', type: RoundResultResponseDto })
  async create(@Body() createRoundResultDto: CreateRoundResultDto): Promise<RoundResult> {
    return this.roundResultService.create(createRoundResultDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all round results' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all round results', type: [RoundResultResponseDto] })
  async findAll(): Promise<RoundResult[]> {
    return this.roundResultService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a round result by id' })
  @ApiParam({ name: 'id', description: 'Round result ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the round result', type: RoundResultResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Round result not found' })
  async findOne(@Param('id') id: string): Promise<RoundResult> {
    return this.roundResultService.findOne(id);
  }

  @Get('round/:roundId')
  @ApiOperation({ summary: 'Get round result by round id' })
  @ApiParam({ name: 'roundId', description: 'Round ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the round result for the specified round', type: RoundResultResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Round result not found' })
  async findByRoundId(@Param('roundId') roundId: string): Promise<RoundResult> {
    return this.roundResultService.findByRoundId(roundId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a round result' })
  @ApiParam({ name: 'id', description: 'Round result ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The round result has been successfully updated.', type: RoundResultResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Round result not found' })
  async update(
    @Param('id') id: string,
    @Body() updateRoundResultDto: UpdateRoundResultDto,
  ): Promise<RoundResult> {
    return this.roundResultService.update(id, updateRoundResultDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a round result' })
  @ApiParam({ name: 'id', description: 'Round result ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The round result has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Round result not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.roundResultService.remove(id);
  }

  @Patch(':id/reveal')
  @ApiOperation({ summary: 'Reveal round results to participants' })
  @ApiParam({ name: 'id', description: 'Round result ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The round result has been successfully revealed.', type: RoundResultResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Round result not found' })
  async revealResults(@Param('id') id: string): Promise<RoundResult> {
    return this.roundResultService.revealResults(id);
  }
}
