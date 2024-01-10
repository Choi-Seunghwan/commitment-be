import { Commitment } from 'src/commitment/commitment.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CommitmentActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  commitmentId: string;

  @Column()
  userId: string;

  @Column()
  createDate: Date;

  @ManyToOne(() => Commitment, (commitment) => commitment.commitmentActivity)
  @JoinColumn({ name: 'commitmentId' })
  commitment: Commitment;

  @ManyToOne(() => User, (user) => user.commitmentActivity)
  @JoinColumn({ name: 'commitmentId' })
  user: User;
}
