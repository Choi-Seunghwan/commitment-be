import { CommitmentActivity } from 'src/commitment-activity/commitment-activity.entity';
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CommitmentHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CommitmentActivity)
  commitmentActivity: CommitmentActivity;

  @CreateDateColumn({ type: 'timestamptz' })
  createDate: Date;
}
