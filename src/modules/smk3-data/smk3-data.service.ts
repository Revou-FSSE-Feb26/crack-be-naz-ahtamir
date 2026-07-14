import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Smk3Data } from './entities/smk3-data.entity';

@Injectable()
export class Smk3DataService {
  constructor(
    @InjectRepository(Smk3Data)
    private readonly smk3DataRepository: Repository<Smk3Data>,
  ) {}

  /**
   * Find all records with optional filters
   */
  async findAll(filters?: {
    subSubElementId?: string;
    findingStatus?: string;
    createdById?: string;
  }) {
    const query = this.smk3DataRepository.createQueryBuilder('smk3_data');

    // Apply filters
    if (filters?.subSubElementId) {
      query.andWhere('smk3_data.subSubElementId = :subSubElementId', {
        subSubElementId: filters.subSubElementId,
      });
    }

    if (filters?.findingStatus) {
      query.andWhere('smk3_data.findingStatus = :findingStatus', {
        findingStatus: filters.findingStatus,
      });
    }

    if (filters?.createdById) {
      query.andWhere('smk3_data.createdById = :createdById', {
        createdById: filters.createdById,
      });
    }

    // Exclude soft-deleted records
    query.andWhere('smk3_data.deletedAt IS NULL');

    // Order by most recent
    query.orderBy('smk3_data.createdAt', 'DESC');

    return await query.getMany();
  }

  /**
   * Find one record by ID
   */
  async findOne(id: string) {
    return await this.smk3DataRepository.findOne({
      where: { id, deletedAt: null },
    });
  }

  /**
   * Create new record
   * FLEXIBLE: Accepts any data structure
   */
  async create(createData: any) {
    const {
      subSubElementId,
      title,
      findingStatus = 'OPEN',
      data = {},
      files = [],
      createdBy,
      createdById,
      ...rest
    } = createData;

    // Merge any extra fields into data JSONB
    const mergedData = {
      ...data,
      ...rest,
    };

    const record = this.smk3DataRepository.create({
      subSubElementId,
      title,
      findingStatus,
      data: mergedData,
      files,
      createdBy,
      createdById,
    });

    return await this.smk3DataRepository.save(record);
  }

  /**
   * Update existing record
   * FLEXIBLE: Accepts any data structure
   */
  async update(id: string, updateData: any) {
    const existingRecord = await this.findOne(id);
    
    if (!existingRecord) {
      throw new NotFoundException('Record not found');
    }

    const {
      subSubElementId,
      title,
      findingStatus,
      data = {},
      files,
      updatedBy,
      updatedById,
      ...rest
    } = updateData;

    // Merge new data with existing data
    const mergedData = {
      ...existingRecord.data,
      ...data,
      ...rest,
    };

    // Update fields
    if (subSubElementId) existingRecord.subSubElementId = subSubElementId;
    if (title) existingRecord.title = title;
    if (findingStatus) existingRecord.findingStatus = findingStatus;
    existingRecord.data = mergedData;
    if (files) existingRecord.files = files;
    if (updatedBy) existingRecord.updatedBy = updatedBy;
    if (updatedById) existingRecord.updatedById = updatedById;

    return await this.smk3DataRepository.save(existingRecord);
  }

  /**
   * Approve finding: Change status from INPG to CLSD
   */
  async approve(id: string) {
    const record = await this.findOne(id);
    
    if (!record) {
      throw new NotFoundException('Record not found');
    }

    record.findingStatus = 'CLSD';
    return await this.smk3DataRepository.save(record);
  }

  /**
   * Soft delete record
   */
  async delete(id: string) {
    const record = await this.findOne(id);
    
    if (!record) {
      throw new NotFoundException('Record not found');
    }

    record.deletedAt = new Date();
    await this.smk3DataRepository.save(record);
    
    return { message: 'Record deleted successfully' };
  }

  /**
   * Hard delete (for admin use)
   */
  async hardDelete(id: string) {
    const result = await this.smk3DataRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException('Record not found');
    }
    
    return { message: 'Record permanently deleted' };
  }
}
