import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commitment } from 'src/commitment/commitment.entity';
import { User } from 'src/user/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CommitmentActivity } from './commitment-activity.entity';
import { CommitmentActivityStatus, CommitmentInfo, CommitmentType } from 'src/commitment/commitment.type';
import { calcCommitmentActivityExpirationDate } from 'src/commitment/commitment.utils';
import { CommitmentInfoBuilder } from 'src/commitment/commitment-info.builder';
import { COMMITMENT_STATUS, COMMITMENT_TYPE } from 'src/commitment/commitment.constant';
import { UserCommitment } from 'src/commitment/user-commitment.entity';

@Injectable()
export class CommitmentActivityService {
  constructor(
    @InjectRepository(Commitment)
    private commitmentRepo: Repository<Commitment>,
    @InjectRepository(CommitmentActivity)
    private commitmentActivityRepo: Repository<CommitmentActivity>,
    @InjectRepository(UserCommitment)
    private userCommitmentRepo: Repository<UserCommitment>,
  ) {}

  async getUserPersonalCommitments({ user, status }: { user: User; status: CommitmentActivityStatus }): Promise<CommitmentInfo[]> {
    const commitmentActivities = await this.commitmentActivityRepo.find({
      where: {
        user: { id: user.id },
        status,
        commitment: { type: COMMITMENT_TYPE.PERSONAL },
      },
      order: {
        createDate: 'DESC',
      },
      relations: ['user', 'commitment'],
    });

    const commitmentInfo: CommitmentInfo[] = commitmentActivities.map((ca) =>
      new CommitmentInfoBuilder().setUserData(user).setCommitmentActivityData(ca).setCommitmentData(ca.commitment).build(),
    );

    return commitmentInfo;
  }

  async getUserPublicCommitments({ user, status }: { user: User; status: CommitmentActivityStatus }): Promise<CommitmentInfo[]> {
    const userCommitments = await this.userCommitmentRepo.find({
      where: {
        user: { id: user.id },
        commitmentActivity: { status },
      },
      order: {
        joinedDate: 'DESC',
      },
      relations: ['user', 'commitment', 'commitmentActivity'],
    });

    const commitmentInfo: CommitmentInfo[] = userCommitments.map((uc) =>
      new CommitmentInfoBuilder()
        .setUserData(user)
        .setCommitmentActivityData(uc.commitmentActivity)
        .setCommitmentData(uc.commitment)
        .build(),
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
    if (!commitmentActivity?.isProgress()) throw new BadRequestException('commitmentActivity is not progress');
    if (commitmentActivity?.isExpired()) throw new BadRequestException('commitmentActivity is expired');

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
      if (!commitmentActivity?.isProgress()) throw new BadRequestException('commitmentActivity is already completed');
      if (commitmentActivity.isExpired()) throw new BadRequestException('commitment already expired');

      commitmentActivity.status = COMMITMENT_STATUS.COMPLETE;
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
