import { CommitmentActivity } from 'src/commitment-activity/commitment-activity.entity';
import { User } from 'src/user/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Commitment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.commitment)
  creator: User;

  @UpdateDateColumn()
  updateDate: Date;

  @CreateDateColumn()
  createDate: Date;

  @OneToMany(() => CommitmentActivity, (commitmentActivity) => commitmentActivity.commitment)
  @JoinColumn({ name: 'commitmentActivity' })
  commitmentActivity: CommitmentActivity;
}
