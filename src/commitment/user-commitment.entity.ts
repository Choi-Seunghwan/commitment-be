import { User } from 'src/user/user.entity';
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Commitment } from './commitment.entity';

@Entity()
export class UserCommitment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userCommitments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Commitment, (commitment) => commitment.userCommitments)
  @JoinColumn({ name: 'commitmentId' })
  commitment: Commitment;

  @CreateDateColumn()
  joinedDate: Date;
}
