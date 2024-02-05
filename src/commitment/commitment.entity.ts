import { CommitmentActivity } from 'src/commitment-activity/commitment-activity.entity';
import { User } from 'src/user/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserCommitment } from './user-commitment.entity';
import { CommitmentType, CommitmentRenewalPeriodDays } from './commitment.type';
import { COMMITMENT_RENEWAL_PERIOD_DAYS, COMMITMENT_TYPE } from './commitment.constant';
import { CommitmentComment } from 'src/comment/commitment-comment.entity';

@Entity()
export class Commitment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.commitments)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Column({ nullable: false, enum: Object.values(COMMITMENT_RENEWAL_PERIOD_DAYS) })
  renewalPeriodDays: CommitmentRenewalPeriodDays; // 갱신 주기 (일 단위)

  @UpdateDateColumn()
  updateDate: Date;

  @CreateDateColumn()
  createDate: Date;

  @OneToMany(() => CommitmentActivity, (commitmentActivity) => commitmentActivity.commitment)
  commitmentActivities: CommitmentActivity[];

  @Column({
    type: 'enum',
    enum: CommitmentType,
    default: COMMITMENT_TYPE.PERSONAL,
  })
  type: string;

  @OneToMany(() => UserCommitment, (userCommitment) => userCommitment.commitment)
  userCommitments: UserCommitment[];

  @OneToMany(() => CommitmentComment, (commitmentComment) => commitmentComment.commitment)
  comments: CommitmentComment[];

  /// functions

  isPublic(): boolean {
    return this.type === COMMITMENT_TYPE.PUBLIC;
  }

  isPersonal(): boolean {
    return this.type === COMMITMENT_TYPE.PERSONAL;
  }
}
