import { CommitmentActivity } from 'src/commitment-activity/commitment-activity.entity';
import { Commitment } from 'src/commitment/commitment.entity';
import { UserCommitment } from 'src/commitment/user-commitment.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: false })
  isGuest: boolean;

  @UpdateDateColumn()
  updateDate: Date;

  @CreateDateColumn()
  createDate: Date;

  @OneToMany(() => Commitment, (commitment) => commitment.creator)
  commitments: Commitment[];

  @OneToMany(() => CommitmentActivity, (commitmentActivity) => commitmentActivity.user)
  commitmentActivities: CommitmentActivity[];

  @OneToMany(() => UserCommitment, (userCommitment) => userCommitment.user)
  userCommitments: UserCommitment[];
}
