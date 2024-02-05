import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommitmentParam } from 'src/commitment/dto/commitment.param';
import { CreateCommentDto } from './dto/comment.dto';
import { JwtAuthGuard } from 'src/security/jwt-auth.guard';
import { AuthUser } from 'src/security/auth-user.decorator';
import { User } from 'src/user/user.entity';

@Controller('/')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/:commitmentId/comment')
  async getCommitmentComments(@Param() param: CommitmentParam): Promise<any> {
    try {
      const { commitmentId } = param;
      const { commitmentCommentInfos, count } = await this.commentService.getCommitmentComments(commitmentId);

      return { comments: commitmentCommentInfos, count };
    } catch (e) {
      throw e;
    }
  }

  @Post('/:commitmentId/comment')
  @UseGuards(JwtAuthGuard)
  async createCommitmentComments(@Param() param: CommitmentParam, @Body() dto: CreateCommentDto, @AuthUser() user: User) {
    try {
      const { commitmentId } = param;
      const { context } = dto;

      const commitmentCommentInfo = await this.commentService.createComment(user, commitmentId, context);

      return { comment: commitmentCommentInfo };
    } catch (e) {
      throw e;
    }
  }
}
