import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commitment } from 'src/commitment/commitment.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommitmentActivityService {
  constructor(
    @InjectRepository(Commitment)
    private commitmentRepo: Repository<Commitment>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async joinCommitment(commitmentId: string, userId: string) {
    try {
      const user: User = await this.userRepo.findOne({ where: { id: userId } });
      const commitment: Commitment = await this.commitmentRepo.findOne({
        where: { id: commitmentId },
      });
    } catch (e) {
      throw e;
    }
  }
}
