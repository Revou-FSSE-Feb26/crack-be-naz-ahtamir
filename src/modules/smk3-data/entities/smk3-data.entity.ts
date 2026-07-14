import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('smk3_data')
export class Smk3Data {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  subSubElementId: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: ['OPEN', 'INPG', 'CLSD'],
    default: 'OPEN',
  })
  @Index()
  findingStatus: string;

  /**
   * FLEXIBLE DATA SCHEMA
   * Store ANY form fields here as JSONB
   * Frontend can add/remove fields without backend changes
   */
  @Column({ type: 'jsonb', default: {} })
  data: Record<string, any>;

  /**
   * Files associated with this record
   * Flexible array to store multiple file uploads
   */
  @Column({ type: 'jsonb', nullable: true })
  files: Array<{
    fieldName: string;
    fileName: string;
    fileUrl: string;
    fileSize?: number;
    mimeType?: string;
  }>;

  @Column()
  createdBy: string;

  @Column()
  @Index()
  createdById: string;

  @Column({ nullable: true })
  updatedBy: string;

  @Column({ nullable: true })
  updatedById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Optional: Soft delete
  @Column({ nullable: true })
  deletedAt: Date;
}
