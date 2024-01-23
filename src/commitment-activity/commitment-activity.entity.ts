import { Commitment } from 'src/commitment/commitment.entity';
import { User } from 'src/user/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CommitmentActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  endDate: Date;

  @ManyToOne(() => Commitment, (commitment) => commitment.commitmentActivity)
  @JoinColumn({ name: 'commitmentId' })
  commitment: Commitment;

  @ManyToOne(() => User, (user) => user.commitmentActivity)
  @JoinColumn({ name: 'userId' })
  user: User;
}
