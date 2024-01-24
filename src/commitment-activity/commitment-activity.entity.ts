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

  // 갱신 날짜
  @Column({ type: 'timestamp', nullable: true })
  renewalDate: Date;

  // 만료 날짜
  @Column({ type: 'timestamp', nullable: true })
  expirationDate: Date;

  // 완료 일자
  @Column({ type: 'timestamp', nullable: true })
  completeDate: Date;

  @ManyToOne(() => Commitment, (commitment) => commitment.commitmentActivity)
  @JoinColumn({ name: 'commitmentId' })
  commitment: Commitment;

  @ManyToOne(() => User, (user) => user.commitmentActivity)
  @JoinColumn({ name: 'userId' })
  user: User;
}
