import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Smk3DataService } from './smk3-data.service';

@Controller('smk3-data')
export class Smk3DataController {
  constructor(private readonly smk3DataService: Smk3DataService) {}

  /**
   * GET /api/smk3-data
   * Fetch records with optional filtering
   */
  @Get()
  async findAll(
    @Query('subSubElementId') subSubElementId?: string,
    @Query('findingStatus') findingStatus?: string,
    @Query('createdById') createdById?: string,
  ) {
    return this.smk3DataService.findAll({
      subSubElementId,
      findingStatus,
      createdById,
    });
  }

  /**
   * GET /api/smk3-data/:id
   * Fetch single record by ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const record = await this.smk3DataService.findOne(id);
    if (!record) {
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    }
    return record;
  }

  /**
   * POST /api/smk3-data
   * Create new record
   * FLEXIBLE: Accepts ANY fields in body
   */
  @Post()
  async create(@Body() body: any) {
    try {
      return await this.smk3DataService.create(body);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create record',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * PUT /api/smk3-data
   * Update existing record
   * FLEXIBLE: Accepts ANY fields in body
   */
  @Put()
  async update(@Body() body: any) {
    try {
      const { id, ...updateData } = body;
      
      if (!id) {
        throw new HttpException('ID is required', HttpStatus.BAD_REQUEST);
      }

      return await this.smk3DataService.update(id, updateData);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update record',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * PATCH /api/smk3-data
   * Approve/Close finding (INPG -> CLSD)
   */
  @Patch()
  async patch(@Body() body: { id: string; action: string }) {
    try {
      const { id, action } = body;

      if (!id || !action) {
        throw new HttpException(
          'ID and action are required',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (action === 'approve') {
        return await this.smk3DataService.approve(id);
      }

      throw new HttpException('Invalid action', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to patch record',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * DELETE /api/smk3-data
   * Delete record by ID
   */
  @Delete()
  async delete(@Query('id') id: string) {
    try {
      if (!id) {
        throw new HttpException('ID is required', HttpStatus.BAD_REQUEST);
      }

      await this.smk3DataService.delete(id);
      return { message: 'Record deleted successfully' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete record',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
