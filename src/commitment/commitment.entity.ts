import { CommitmentActivity } from 'src/commitment-activity/commitment-activity.entity';
import { User } from 'src/user/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Commitment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.commitment)
  creator: User;

  @Column()
  renewalPeriodDays: number; // 갱신 주기 (일 단위)

  @UpdateDateColumn()
  updateDate: Date;

  @CreateDateColumn()
  createDate: Date;

  @OneToMany(() => CommitmentActivity, (commitmentActivity) => commitmentActivity.commitment)
  @JoinColumn({ name: 'commitmentActivity' })
  commitmentActivity: CommitmentActivity;
}
