import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commitment } from './commitment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { CommitmentActivityService } from 'src/commitment-activity/commitment-activity.service';
import { CommitmentInfo } from './commitment.type';
import { COMMITMENT_RENEWAL_PERIOD_DAYS, COMMITMENT_TYPE } from './commitment.constant';
import { UserCommitment } from './user-commitment.entity';
import { CommitmentInfoBuilder } from './commitment-info.builder';
import { paginate } from 'src/utils/pagination';
// import { CommitmentActivity } from 'src/commitment-activity/commitment-activity.entity';

@Injectable()
export class CommitmentService {
  constructor(
    @InjectRepository(Commitment)
    private commitmentRepo: Repository<Commitment>,
    @InjectRepository(UserCommitment)
    private userCommitmentRepo: Repository<UserCommitment>,
    // @InjectRepository(CommitmentActivity)
    // private commitmentActivityRepo: Repository<CommitmentActivity>,

    private commitmentActivityService: CommitmentActivityService,
  ) {}

  async getPublicCommitments({ user, page = 1, limit = 10 }: { user: User; page: number; limit: number }): Promise<CommitmentInfo[]> {
    try {
      const commitments = await this.commitmentRepo.find({ where: { type: COMMITMENT_TYPE.PUBLIC } });

      const commitmentInfos: CommitmentInfo[] = commitments.map((c) => new CommitmentInfoBuilder().setCommitmentData(c).build());

      return commitmentInfos;
    } catch (e) {
      throw e;
    }
  }

  async getLatestPublicCommitments({ user, page = 1, limit = 10 }: { user: User; page: number; limit: number }) {
    try {
      const paginatedCommitments = await paginate(this.commitmentRepo, page, limit, {
        where: { type: COMMITMENT_TYPE.PUBLIC },
        relations: [],
        order: { createDate: 'DESC' },
      })();

      const commitmentInfos: CommitmentInfo[] = paginatedCommitments?.data?.map((c) =>
        new CommitmentInfoBuilder().setCommitmentData(c).build(),
      );

      // paginatedCommitments.data = commitmentInfos;
      return { commitmentInfos, count: paginatedCommitments.count };
    } catch (e) {
      throw e;
    }
  }

  /** todo Popular */
  async getPopularPublicCommitments({ user, page = 1, limit = 10 }: { user: User; page: number; limit: number }) {
    try {
      const paginatedCommitments = await paginate(this.commitmentRepo, page, limit, {
        where: { type: COMMITMENT_TYPE.PUBLIC },
        relations: [],
      })();

      const commitmentInfos: CommitmentInfo[] = paginatedCommitments?.data?.map((c) =>
        new CommitmentInfoBuilder().setCommitmentData(c).build(),
      );

      // paginatedCommitments.data = commitmentInfos;
      return { commitmentInfos, count: paginatedCommitments.count };
    } catch (e) {
      throw e;
    }
  }

  async createCommitment({
    user,
    title,
    description,
    type,
    renewalPeriodDays = COMMITMENT_RENEWAL_PERIOD_DAYS.Seven,
  }: {
    user: User;
    title: string;
    description: string;
    type: string;
    renewalPeriodDays: number;
  }): Promise<CommitmentInfo> {
    try {
      const commitment: Commitment = this.commitmentRepo.create({
        title,
        description,
        renewalPeriodDays,
        creator: user,
        type,
      });

      await this.commitmentRepo.save(commitment);

      let commitmentInfo: CommitmentInfo;

      if (type === COMMITMENT_TYPE.PUBLIC) commitmentInfo = await this.joinCommitment(commitment, user);
      else {
        const commitmentActivity = await this.commitmentActivityService.activeCommitment(commitment, user);

        commitmentInfo = new CommitmentInfoBuilder()
          .setUserData(user)
          .setCommitmentActivityData(commitmentActivity)
          .setCommitmentData(commitment)
          .build();
      }

      return commitmentInfo;
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

  async joinCommitment(commitmen: Commitment, user: User): Promise<CommitmentInfo>;
  async joinCommitment(commitmentId: string, user: User): Promise<CommitmentInfo>;
  async joinCommitment(commitmentOrId: Commitment | string, user: User): Promise<CommitmentInfo> {
    try {
      let commitment: Commitment;

      if (typeof commitmentOrId === 'string') commitment = await this.commitmentRepo.findOne({ where: { id: commitmentOrId } });
      else commitment = commitmentOrId;

      if (!commitment) throw new BadRequestException('commitment not founded');
      if (!commitment.isPublic()) throw new BadRequestException('commitment type not public');

      const prevUserCommitment = await this.userCommitmentRepo.findOne({
        where: { user: { id: user.id }, commitment: { id: commitment.id } },
        relations: ['user', 'commitment'],
      });

      if (prevUserCommitment) throw new BadRequestException('already userCommitment. user already joined');

      const commitmentActivity = await this.commitmentActivityService.activeCommitment(commitment, user);

      const createdUserCommitment = this.userCommitmentRepo.create({
        user,
        commitment,
        commitmentActivity,
      });
      await this.userCommitmentRepo.save(createdUserCommitment);

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

  async leaveCommitment(commitmentId: string, user: User) {
    const commitment = await this.commitmentRepo.findOne({ where: { id: commitmentId } });

    if (!commitment) throw new BadRequestException('commitment not founded');
    if (commitment.type !== COMMITMENT_TYPE.PUBLIC) throw new BadRequestException('commitment type not public');

    const userCommitment = await this.userCommitmentRepo.findOne({
      where: { user: { id: user.id }, commitment: { id: commitmentId } },
    });

    if (!userCommitment) throw new BadRequestException('userCommitment not found, user not joined');

    await this.commitmentActivityService.completeCommitment(commitmentId, user);
    await this.userCommitmentRepo.delete({ id: userCommitment.id });

    return true;
  }
}
