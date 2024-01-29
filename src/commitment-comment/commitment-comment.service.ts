import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommitmentService } from 'src/commitment/commitment.service';
import { User } from 'src/user/user.entity';
import { CommitmentComment } from './commitment-comment.entity';
import { Repository } from 'typeorm';
import { validateCommentContent } from './commitment-comment.utils';
import { CommitmentCommentInfo } from './commitment-comment.type';
import { commitmentCommentMapper } from './commitment-comment.mapper';
import { userInfoMapper } from 'src/user/user.mapper';
import { COMMITMENT_TYPE } from 'src/commitment/commitment.constant';

@Injectable()
export class CommitmentCommentService {
  constructor(
    private commitmentService: CommitmentService,
    @InjectRepository(CommitmentComment)
    private commitmentCommentRepo: Repository<CommitmentComment>,
  ) {}

  async createComment(commitmentId: string, user: User, content: string): Promise<CommitmentCommentInfo> {
    try {
      if (!validateCommentContent(content)) throw new BadRequestException('Comment content exceeds maximum length. 100');

      const commitment = await this.commitmentService.getCommitment(commitmentId);

      if (commitment.type !== COMMITMENT_TYPE.PUBLIC) throw new BadRequestException('Comment Commitment is not PUBLIC');

      const comment = this.commitmentCommentRepo.create({ user: { id: user.id }, commitment: { id: commitment.id }, content });
      await this.commitmentCommentRepo.save(comment);

      const userInfo = userInfoMapper(user);
      const commitmentCommentInfo: CommitmentCommentInfo = commitmentCommentMapper(comment, userInfo);

      return commitmentCommentInfo;
    } catch (e) {
      throw e;
    }
  }

  async getCommitments(commitmentId: string): Promise<CommitmentCommentInfo[]> {
    try {
      const comments = await this.commitmentCommentRepo.find({ where: { commitment: { id: commitmentId } }, relations: ['user'] });

      const commentInfos = comments.map((c) => commitmentCommentMapper(c, userInfoMapper(c.user)));

      return commentInfos;
    } catch (e) {
      throw e;
    }
  }

  async updateComment(commitmentId: string, commentId: string, user: User, content: string): Promise<CommitmentCommentInfo> {
    try {
      if (!validateCommentContent(content)) throw new BadRequestException('Comment content exceeds maximum length. 100');

      const comment = await this.commitmentCommentRepo.findOne({
        where: { commitment: { id: commitmentId }, id: commentId, user: { id: user.id } },
        relations: ['user'],
      });

      if (!comment) throw new BadRequestException('update comment not found');

      comment.content = content;

      await this.commitmentCommentRepo.save(comment);
      const userInfo = userInfoMapper(user);
      const commitmentCommentInfo: CommitmentCommentInfo = commitmentCommentMapper(comment, userInfo);

      return commitmentCommentInfo;
    } catch (e) {
      throw e;
    }
  }
}
