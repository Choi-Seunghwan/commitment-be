import { CommitmentActivity } from 'src/commitment-activity/commitment-activity.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @OneToMany(
    () => CommitmentActivity,
    (commitmentActivity) => commitmentActivity.user,
  )
  @JoinColumn({ name: 'commitmentActivity' })
  commitmentActivity: CommitmentActivity;
}
