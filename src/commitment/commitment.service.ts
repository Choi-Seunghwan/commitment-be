import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commitment } from './commitment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { CommitmentActivityService } from 'src/commitment-activity/commitment-activity.service';
import { CommitmentInfo, CommitmentType } from './commitment';
import { COMMITMENT_TYPE } from './commitment.constant';
import { UserCommitment } from './user-commitment.entity';
import { CommitmentActivity } from 'src/commitment-activity/commitment-activity.entity';

@Injectable()
export class CommitmentService {
  constructor(
    @InjectRepository(Commitment)
    private commitmentRepo: Repository<Commitment>,
    @InjectRepository(UserCommitment)
    private userCommitmentRepo: Repository<UserCommitment>,
    @InjectRepository(CommitmentActivity)
    private commitmentActivityRepo: Repository<CommitmentActivity>,

    private commitmentActivityService: CommitmentActivityService,
  ) {}

  async createCommitment({ user, title, type }: { user: User; title: string; type: string }): Promise<CommitmentInfo> {
    try {
      if (!user?.id) throw new BadRequestException('user not founded');
      const commitment: Commitment = this.commitmentRepo.create({
        title,
        renewalPeriodDays: 7,
        creator: user,
        type,
      });

      await this.commitmentRepo.save(commitment);
      const commitmentInfo = this.commitmentActivityService.activeCommitment(commitment, user);

      return commitmentInfo;
    } catch (e) {
      throw e;
    }
  }

  async getCommitmentList(user: User) {
    try {
      const commitments: Commitment[] = await this.commitmentRepo.find({ where: { creator: user } });

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

  async joinCommitment(commitmentId: string, user: User): Promise<CommitmentInfo> {
    const commitment = await this.commitmentRepo.findOne({ where: { id: commitmentId } });

    if (!commitment) throw new BadRequestException('commitment not founded');
    if (commitment.type !== COMMITMENT_TYPE.PUBLIC) throw new BadRequestException('commitment type not public');

    const prevUserCommitment = await this.userCommitmentRepo.findOne({
      where: { user: { id: user.id }, commitment: { id: commitmentId } },
    });

    if (prevUserCommitment) throw new BadRequestException('already userCommitment. user already joined');

    const createdUserCommitment = this.userCommitmentRepo.create({ user, commitment });
    await this.userCommitmentRepo.save(createdUserCommitment);

    const commitmentInfo = await this.commitmentActivityService.activeCommitment(commitment, user);

    return commitmentInfo;
  }

  async leaveCommitment(commitmentId: string, user: User) {
    const commitment = await this.commitmentRepo.findOne({ where: { id: commitmentId } });

    if (!commitment) throw new BadRequestException('commitment not founded');
    if (commitment.type !== COMMITMENT_TYPE.PUBLIC) throw new BadRequestException('commitment type not public');

    const userCommitment = await this.userCommitmentRepo.findOne({
      where: { user: { id: user.id }, commitment: { id: commitmentId } },
    });

    if (!userCommitment) throw new BadRequestException('userCommitment not found, user not joined');

    const commitmentActivity = await this.commitmentActivityRepo.findOne({
      where: {
        user: { id: user.id },
        commitment: { id: commitment.id },
      },
    });

    if (commitmentActivity) {
      const now = new Date();
      commitmentActivity.completeDate = now;
      commitmentActivity.isActive = false;
      await this.commitmentActivityRepo.save(commitmentActivity);
    }

    await this.userCommitmentRepo.delete({ id: userCommitment.id });

    return true;
  }
}
