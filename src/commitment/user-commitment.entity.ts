import { User } from 'src/user/user.entity';
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Commitment } from './commitment.entity';
import { CommitmentActivity } from 'src/commitment-activity/commitment-activity.entity';

@Entity()
export class UserCommitment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userCommitments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Commitment, (commitment) => commitment.userCommitments)
  @JoinColumn({ name: 'commitmentId' })
  commitment: Commitment;

  @OneToOne(() => CommitmentActivity, (commitmentActivity) => commitmentActivity.userCommitment)
  @JoinColumn({ name: 'commitmentActivityId' })
  commitmentActivity: CommitmentActivity;

  @CreateDateColumn({ type: 'timestamptz' })
  joinedDate: Date;
}
