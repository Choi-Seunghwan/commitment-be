import { CommitmentActivity } from 'src/commitment-activity/commitment-activity.entity';
import { User } from 'src/user/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserCommitment } from './user-commitment.entity';
import { CommitmentType } from './commitment.type';
import { COMMITMENT_TYPE } from './commitment.constant';

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

  @Column({ nullable: false, enum: [7] })
  renewalPeriodDays: number; // 갱신 주기 (일 단위)

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

  /// functions

  isPublic(): boolean {
    return this.type === COMMITMENT_TYPE.PUBLIC;
  }

  isPersonal(): boolean {
    return this.type === COMMITMENT_TYPE.PERSONAL;
  }
}
