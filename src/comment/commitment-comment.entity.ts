import { Commitment } from 'src/commitment/commitment.entity';
import { User } from 'src/user/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CommitmentComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createDate: Date;

  @ManyToOne(() => User, (user) => user.commitmentComments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Commitment, (commitment) => commitment.comments)
  commitment: Commitment;
}
