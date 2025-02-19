import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { AvailableRoles } from './role.enum';


@Entity()
export class User {
    
  @PrimaryGeneratedColumn('uuid')
  id: string;
   
  
  @Column({unique:true})
  username: string;
  

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: AvailableRoles,
    default: AvailableRoles.NORMAL, 
  })
  roles: AvailableRoles;

  @Column({ default: true })
  verified: boolean;
}
