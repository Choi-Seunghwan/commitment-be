import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commitment } from 'src/commitment/commitment.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CommitmentActivity } from './commitment-activity.entity';

@Injectable()
export class CommitmentActivityService {
  constructor(
    @InjectRepository(Commitment)
    private commitmentRepo: Repository<Commitment>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(CommitmentActivity)
    private commitmentActivityRepo: Repository<CommitmentActivity>,
  ) {}

  async getUserCommitments(user: User) {
    if (!user) throw new BadRequestException('user Badrequest');
  }

  async joinCommitment(commitmentId: string, user: User) {
    try {
      // todo: 이와 같이 argument 로 받는 것들, decorator로 validate 체크 하도록 할 수 있을 듯
      if (!commitmentId || !user) throw new BadRequestException('commitmentId or user BadRequest');

      const commitment: Commitment = await this.commitmentRepo.findOne({
        where: { id: commitmentId },
      });

      if (!user || !commitment) throw new NotFoundException('user or commitment not found');

      const commitmentActivity = this.commitmentActivityRepo.create({
        user,
        commitment,
      });

      const createdCommitmentActivity = await this.commitmentActivityRepo.save(commitmentActivity);
      return createdCommitmentActivity;
    } catch (e) {
      throw e;
    }
  }

  async leaveCommitment(commitmentId: string, userId: string) {
    try {
      const commitmentActivity = await this.commitmentActivityRepo.findOne({
        where: {
          commitment: { id: commitmentId },
          user: { id: userId },
          isActive: true,
        },
      });

      if (!commitmentActivity) throw new BadRequestException('commitment not found');

      commitmentActivity.isActive = false;
      commitmentActivity.endDate = new Date();

      return await this.commitmentActivityRepo.save(commitmentActivity);
    } catch (e) {
      throw e;
    }
  }
}
