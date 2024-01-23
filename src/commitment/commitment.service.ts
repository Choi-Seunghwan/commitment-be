import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commitment } from './commitment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { CommitmentActivityService } from 'src/commitment-activity/commitment-activity.service';

@Injectable()
export class CommitmentService {
  constructor(
    @InjectRepository(Commitment)
    private commitmentRepo: Repository<Commitment>,
    private commitmentActivityService: CommitmentActivityService,
  ) {}

  async createCommitment({ user, title }: { user: User; title: string }): Promise<Commitment> {
    try {
      if (!user?.id) throw new BadRequestException('user not founded');

      const commitment: Commitment = await this.commitmentRepo.create({
        title,
        creator: user,
      });

      await this.commitmentRepo.save(commitment);

      this.commitmentActivityService.joinCommitment(commitment, user);

      return commitment;
    } catch (e) {
      throw e;
    }
  }

  async getCommitmentList() {
    try {
      const commitments: Commitment[] = await this.commitmentRepo.find();

      return commitments;
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
