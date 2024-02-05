import { Injectable } from '@nestjs/common';
import { CommitmentComment } from './comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'src/utils/pagination';
import { User } from 'src/user/user.entity';
import { Commitment } from 'src/commitment/commitment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommitmentComment)
    private commitmentCommentRepo: Repository<CommitmentComment>,

    @InjectRepository(Commitment)
    private commitmentRepo: Repository<Commitment>,

    
  ) {}

  async getCommitmentComments(commitmentId: string, page = 1, limit = 10) {
    const results = await paginate(this.commitmentCommentRepo, page, limit, { where: { commitment: { id: commitmentId } } })();

    return results;
  }

  async createComment(user: User, commitmentId: string, content: string) {
    


    const comment: Comment = this.commitmentCommentRepo.create({
      user,
      content,
      commitment: 
    });
  }
}
