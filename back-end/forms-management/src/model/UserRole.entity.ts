import { Entity, ManyToOne, PrimaryColumn, JoinColumn, Column } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity()
export class UserRole {
  @PrimaryColumn('uuid')
  userId: string;

  @PrimaryColumn('uuid')
  roleId: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User; 

  @ManyToOne(() => Role, { nullable: false })
  @JoinColumn({ name: 'roleId' })
  role: Role; 

  @Column({ default: 'active' })
  status: string;
}
