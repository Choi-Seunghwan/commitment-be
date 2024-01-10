import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    private userRepo: Repository<User>,
  ) {}

  async createCommitment(
    title: string,
    description: string,
    userId: string,
  ): Promise<boolean> {
    try {
      const user: User = await this.userRepo.findOne({ where: { id: userId } });

      if (!user) throw new BadRequestException('user not founded');

      const commitment: Commitment = await this.commitmentRepo.create({
        title,
        description,
        creator: user,
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

  async getCommitment(commitmentId: string) {
    try {
      if (!commitmentId) throw new BadRequestException('commitmentId Error');

      const commitment: Commitment = await this.commitmentRepo.findOne({
        where: { id: commitmentId },
      });

      if (!commitment) throw new NotFoundException('commitment not found');

      return commitment;
    } catch (e) {
      throw e;
    }
  }
}
