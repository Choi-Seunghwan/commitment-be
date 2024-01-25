import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commitment } from 'src/commitment/commitment.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CommitmentActivity } from './commitment-activity.entity';
import { CommitmentInfo } from 'src/commitment/commitment';
import { calcCommitmentActivityExpirationDate } from 'src/commitment/commitment.utils';
import { CommitmentInfoBuilder } from 'src/commitment/commitment-info.builder';

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
        user: { id: user.id },
        isActive,
      },
      relations: ['user', 'commitment'],
    });

    const commitmentInfo: CommitmentInfo[] = commitmentActivity.map((ca) =>
      new CommitmentInfoBuilder().setUserData(user).setCommitmentActivityData(ca).setCommitmentData(ca.commitment).build(),
    );
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

      await this.commitmentActivityRepo.save(commitmentActivity);

      // todo: 이 로직 한번에 하도록 wrapping 해야 할 듯?
      const commitmentInfo = new CommitmentInfoBuilder()
        .setUserData(user)
        .setCommitmentActivityData(commitmentActivity)
        .setCommitmentData(commitment)
        .build();

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
