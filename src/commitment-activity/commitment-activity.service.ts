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

  async getUserCommitments(user: User, isActive = true) {
    if (!user) throw new BadRequestException('user Badrequest');

    const commitmentActivity = await this.commitmentActivityRepo.find({
      where: {
        user: user,
        isActive,
      },
      relations: ['commitment'],
    });

    const commitments = commitmentActivity.map((item) => item.commitment);
    return commitments;
  }

  async joinCommitment(commitment: Commitment, user: User);
  async joinCommitment(commitmentId: string, user: User);
  async joinCommitment(commitmentOrId: string | Commitment, user: User): Promise<Commitment> {
    try {
      // todo: 이와 같이 argument 로 받는 것들, decorator로 validate 체크 하도록 할 수 있을 듯
      if (!commitmentOrId || !user) throw new BadRequestException('commitmentId or user BadRequest');

      let commitment: Commitment;

      if (typeof commitmentOrId === 'string')
        commitment = await this.commitmentRepo.findOne({
          where: { id: commitmentOrId },
          relations: ['commitment'],
        });
      else commitment = commitmentOrId;

      if (!user || !commitment) throw new NotFoundException('user or commitment not found');

      const commitmentActivity = this.commitmentActivityRepo.create({
        user,
        commitment,
      });

      const createdCommitmentActivity = await this.commitmentActivityRepo.save(commitmentActivity);

      return createdCommitmentActivity?.commitment;
    } catch (e) {
      throw e;
    }
  }

  async completeCommitment(commitmentId: string, user: User): Promise<Commitment> {
    try {
      const commitmentActivity = await this.commitmentActivityRepo.findOne({
        where: {
          commitment: { id: commitmentId },
          user: user,
          isActive: true,
        },
        relations: ['commitment'],
      });

      if (!commitmentActivity) throw new BadRequestException('commitment not found');

      commitmentActivity.isActive = false;
      commitmentActivity.endDate = new Date();

      await this.commitmentActivityRepo.save(commitmentActivity);

      return commitmentActivity?.commitment;
    } catch (e) {
      throw e;
    }
  }
}
