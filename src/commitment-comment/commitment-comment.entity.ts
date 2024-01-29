import { Commitment } from 'src/commitment/commitment.entity';
import { User } from 'src/user/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CommitmentComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @ManyToOne(() => Commitment, (commimtment) => commimtment.comments)
  @JoinColumn({ name: 'commitmentId' })
  commitment: Commitment;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createDate: Date;
}
