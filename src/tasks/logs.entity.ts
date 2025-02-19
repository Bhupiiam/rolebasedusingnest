import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum LogAction {
  SELF_UPDATE = 'SELF_UPDATE',
  ADMIN_UPDATE = 'ADMIN_UPDATE',
}

@Entity()
export class Logs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string; 

  @Column({ nullable: true })
  updatedBy: string; 

  @Column({
    type: 'enum',
    enum: LogAction,
  })
  action: LogAction;

  @CreateDateColumn()
  createdAt: Date;
}
