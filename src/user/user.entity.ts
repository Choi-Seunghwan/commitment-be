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

  @Column({ unique: true })
  email: string;

  @Column()
  nickname: string;

  @Column()
  password: string;

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
