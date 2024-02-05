import { Injectable } from '@nestjs/common';
import { CommitmentComment } from './commitment-comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'src/utils/pagination';
import { User } from 'src/user/user.entity';
import { CommitmentService } from 'src/commitment/commitment.service';
import { CommitmentCommentInfo } from './comment.type';
import { CommitmentCommentInfoBuilder } from './commitment-comment-info.builder';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommitmentComment)
    private commitmentCommentRepo: Repository<CommitmentComment>,

    private readonly commitmentService: CommitmentService,
  ) {}

  async getCommitmentComments(commitmentId: string, page = 1, limit = 10) {
    const results = await paginate(this.commitmentCommentRepo, page, limit, {
      where: { commitment: { id: commitmentId } },
      relations: ['user'],
    })();

    const commitmentCommentInfos = results?.data?.map((cc) =>
      new CommitmentCommentInfoBuilder().setUserData(cc.user).setCommitmentCommentData(cc).build(),
    );
    return { commitmentCommentInfos, count: results?.count };
  }

  async createComment(user: User, commitmentId: string, content: string): Promise<CommitmentCommentInfo> {
    const commitment = await this.commitmentService.getCommitment(commitmentId);

    const comment: CommitmentComment = this.commitmentCommentRepo.create({
      user: { id: user.id },
      content,
      commitment: { id: commitment.id },
    });

    await this.commitmentCommentRepo.save(comment);

    return new CommitmentCommentInfoBuilder().setUserData(user).setCommitmentCommentData(comment).build();
  }
}
