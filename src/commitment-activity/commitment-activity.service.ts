import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commitment } from 'src/commitment/commitment.entity';
import { User } from 'src/user/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CommitmentActivity } from './commitment-activity.entity';
import { CommitmentInfo } from 'src/commitment/commitment.type';
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
    const commitmentActivities = await this.commitmentActivityRepo.find({
      where: {
        user: { id: user.id },
        isActive,
      },
      relations: ['user', 'commitment'],
    });

    const commitmentInfo: CommitmentInfo[] = commitmentActivities.map((ca) =>
      new CommitmentInfoBuilder().setUserData(user).setCommitmentActivityData(ca).setCommitmentData(ca.commitment).build(),
    );
    return commitmentInfo;
  }

  async getUserCommitment(user: User, commitmentId: string): Promise<CommitmentInfo> {
    const commitmentActivity = await this.commitmentActivityRepo.findOne({
      where: {
        user: { id: user.id },
        commitment: { id: commitmentId },
      },
      relations: ['user', 'commitment'],
    });

    if (!commitmentActivity) throw new NotFoundException('commitment not founded');

    const commitmentInfo = new CommitmentInfoBuilder()
      .setUserData(user)
      .setCommitmentActivityData(commitmentActivity)
      .setCommitmentData(commitmentActivity.commitment)
      .build();

    return commitmentInfo;
  }

  async getCommitmentActivity(commitmentId: string, userId: string, latest = true) {
    const query: FindOneOptions<CommitmentActivity> = {
      where: {
        user: { id: userId },
        commitment: { id: commitmentId },
      },
      relations: ['commitment'],
    };

    if (latest)
      query.order = {
        createDate: 'DESC',
      };

    const commitmentActivity: CommitmentActivity = await this.commitmentActivityRepo.findOne(query);

    return commitmentActivity;
  }

  async renewCommitment(commitmentId: string, user: User): Promise<CommitmentInfo> {
    const commitmentActivity = await this.getCommitmentActivity(commitmentId, user.id, true);

    if (!commitmentActivity) throw new BadRequestException('commitmentActivity not found');
    if (!commitmentActivity?.isActive) throw new BadRequestException('commitmentActivity is not activated');

    const renewalDate = new Date();
    const expirationDate = calcCommitmentActivityExpirationDate(renewalDate, commitmentActivity?.commitment?.renewalPeriodDays);

    commitmentActivity.renewalDate = renewalDate;
    commitmentActivity.expirationDate = expirationDate;

    await this.commitmentActivityRepo.save(commitmentActivity);

    const commitmentInfo = new CommitmentInfoBuilder()
      .setUserData(user)
      .setCommitmentActivityData(commitmentActivity)
      .setCommitmentData(commitmentActivity.commitment)
      .build();

    return commitmentInfo;
  }

  async activeCommitment(commitment: Commitment, user: User): Promise<CommitmentInfo>;
  async activeCommitment(commitmentId: string, user: User): Promise<CommitmentInfo>;
  async activeCommitment(commitmentOrId: Commitment | string, user: User): Promise<CommitmentInfo> {
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

  async completeCommitment(commitmentId: string, user: User): Promise<CommitmentInfo> {
    try {
      const commitmentActivity = await this.commitmentActivityRepo.findOne({
        where: {
          commitment: { id: commitmentId },
          user: { id: user.id },
        },
        relations: ['commitment'],
      });
      const now = new Date();

      if (!commitmentActivity) throw new NotFoundException('commitmentActivity not found');
      if (!commitmentActivity?.isActive || commitmentActivity.completeDate)
        throw new BadRequestException('commitmentActivity is already completed');
      if (commitmentActivity.expirationDate < now) throw new BadRequestException('commitment already expired');

      commitmentActivity.isActive = false;
      commitmentActivity.completeDate = now;

      await this.commitmentActivityRepo.save(commitmentActivity);

      const commitmentInfo = new CommitmentInfoBuilder()
        .setUserData(user)
        .setCommitmentActivityData(commitmentActivity)
        .setCommitmentData(commitmentActivity.commitment)
        .build();

      return commitmentInfo;
    } catch (e) {
      throw e;
    }
  }
}
