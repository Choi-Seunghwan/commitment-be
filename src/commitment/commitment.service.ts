import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commitment } from './commitment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { findCommitmentMapper } from './commitment.mapper';

@Injectable()
export class CommitmentService {
  constructor(
    @InjectRepository(Commitment)
    private commitmentRepo: Repository<Commitment>,
  ) {}

  async createCommitment(
    title: string,
    description: string,
    creator: User,
  ): Promise<boolean> {
    try {
      const commitment: Commitment = await this.commitmentRepo.create({
        title,
        description,
        creator,
      });
      await this.commitmentRepo.save(commitment);

      return true;
    } catch (e) {
      throw e;
    }
  }

  async getCommitmentList() {
    try {
      const commitments: Commitment[] = await this.commitmentRepo.find();
      const result = commitments.map(findCommitmentMapper);

      return result;
    } catch (e) {
      throw e;
    }
  }
}
