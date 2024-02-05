import { Commitment } from 'src/commitment/commitment.entity';
import { User } from 'src/user/user.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CommitmentComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createDate: Date;

  @Column()
  user: User;

  @OneToMany(() => Commitment, (commitment) => commitment.comments)
  commitment: Commitment[];
}
