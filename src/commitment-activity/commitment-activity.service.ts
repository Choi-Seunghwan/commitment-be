import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commitment } from 'src/commitment/commitment.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CommitmentActivity } from './commitment-activity.entity';
import { CommitmentInfo } from 'src/commitment/commitment';
import { commitmentActivityInfoMapper, commitmentInfoMapper } from 'src/commitment/commitment.mapper';
import { calcCommitmentActivityExpirationDate } from 'src/commitment/commitment.utils';
import { userInfoMapper } from 'src/user/user.mapper';

@Injectable()
export class CommitmentActivityService {
  constructor(
    @InjectRepository(Commitment)
    private commitmentRepo: Repository<Commitment>,
    @InjectRepository(CommitmentActivity)
    private commitmentActivityRepo: Repository<CommitmentActivity>,
  ) {}

  async getUserCommitments(user: User, isActive = true): Promise<CommitmentInfo[]> {
    if (!user) throw new BadRequestException('user Badrequest');

    const commitmentActivity = await this.commitmentActivityRepo.find({
      where: {
        user: user,
        isActive,
      },
      relations: ['commitment'],
    });

    const commitmentInfo: CommitmentInfo[] = commitmentActivity.map((ca) => {
      const commitment = ca.commitment;
      const userInfo = userInfoMapper(user);
      const commitmentInfo = commitmentInfoMapper(commitment, userInfo);
      const commitmentActivityInfo = commitmentActivityInfoMapper(ca);
      commitmentInfo.activity = commitmentActivityInfo;

      return commitmentInfo;
    });
    return commitmentInfo;
  }

  async renewCommitment(commitmentId: string, user: User) {
    if (!commitmentId || !user) throw new BadRequestException('commitmentId or user BadRequest');

    const commitmentActivity = await this.commitmentActivityRepo.findOne({
      where: {
        commitment: { id: commitmentId },
        user: user,
        isActive: true,
      },
      relations: ['commitment'],
    });

    if (!commitmentActivity) throw new BadRequestException('commitmentActivity not found');

    const renewalDate = new Date();

    const expirationDate = calcCommitmentActivityExpirationDate(renewalDate, commitmentActivity?.commitment?.renewalPeriodDays);

    commitmentActivity.renewalDate = renewalDate;
    commitmentActivity.expirationDate = expirationDate;

    await this.commitmentActivityRepo.save(commitmentActivity);

    return commitmentActivity?.commitment;
  }

  async joinCommitment(commitment: Commitment, user: User);
  async joinCommitment(commitmentId: string, user: User);
  async joinCommitment(commitmentOrId: string | Commitment, user: User): Promise<CommitmentInfo> {
    try {
      // todo: 이와 같이 argument 로 받는 것들, decorator로 validate 체크 하도록 할 수 있을 듯
      if (!commitmentOrId || !user) throw new BadRequestException('commitmentOrId or user BadRequest');

      let commitment: Commitment;

      if (typeof commitmentOrId === 'string')
        commitment = await this.commitmentRepo.findOne({
          where: { id: commitmentOrId },
        });
      else commitment = commitmentOrId;

      if (!user || !commitment) throw new NotFoundException('user or commitment not found');

      const renewalDate = new Date();
      const expirationDate = calcCommitmentActivityExpirationDate(renewalDate, commitment.renewalPeriodDays);

      const commitmentActivity = this.commitmentActivityRepo.create({
        user,
        commitment,
        renewalDate,
        expirationDate,
      });

      const createdCommitmentActivity = await this.commitmentActivityRepo.save(commitmentActivity);

      // todo: 이 로직 한번에 하도록 wrapping 해야 할 듯?
      const userInfo = userInfoMapper(user);
      const commitmentInfo = commitmentInfoMapper(commitment, userInfo);
      const commitmentActivityInfo = commitmentActivityInfoMapper(createdCommitmentActivity);
      commitmentInfo.activity = commitmentActivityInfo;

      return commitmentInfo;
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

      if (!commitmentActivity) throw new BadRequestException('commitmentActivity not found');

      commitmentActivity.isActive = false;
      commitmentActivity.completeDate = new Date();

      await this.commitmentActivityRepo.save(commitmentActivity);

      return commitmentActivity?.commitment;
    } catch (e) {
      throw e;
    }
  }
}
