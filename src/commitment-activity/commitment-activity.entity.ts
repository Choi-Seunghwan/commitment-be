import { COMMITMENT_STATUS } from 'src/commitment/commitment.constant';
import { Commitment } from 'src/commitment/commitment.entity';
import { CommitmentActivityStatus } from 'src/commitment/commitment.type';
import { UserCommitment } from 'src/commitment/user-commitment.entity';
import { User } from 'src/user/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CommitmentActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createDate: Date;

  /** 갱신 날짜 */
  @Column({ type: 'timestamp' })
  renewalDate: Date;

  /** 만료 날짜 */
  @Column({ type: 'timestamp' })
  expirationDate: Date;

  /** 완료 일자 */
  @Column({ type: 'timestamp', nullable: true })
  completeDate: Date;

  @Column({
    type: 'enum',
    enum: CommitmentActivityStatus,
    default: COMMITMENT_STATUS.PROGRESS,
  })
  status: string;

  @ManyToOne(() => Commitment, (commitment) => commitment.commitmentActivities)
  @JoinColumn({ name: 'commitmentId' })
  commitment: Commitment;

  @ManyToOne(() => User, (user) => user.commitmentActivities)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => UserCommitment, (userCommitment) => userCommitment.commitmentActivity, { nullable: true })
  userCommitment?: UserCommitment;

  /// functions
  isProgress(): boolean {
    return this.status === COMMITMENT_STATUS.PROGRESS;
  }

  isExpired(): boolean {
    const now = new Date();
    return this.expirationDate < now;
  }
}
