import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommitmentParam } from 'src/commitment/dto/commitment.param';
import { CreateCommentDto } from './dto/comment.dto';
import { JwtAuthGuard } from 'src/security/jwt-auth.guard';

@Controller('/')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/:commitmentId/comment')
  async getCommitmentComments(@Param() param: CommitmentParam): Promise<any> {
    try {
      const { commitmentId } = param;
      const { data, count } = await this.commentService.getCommitmentComments(commitmentId);

      return { comments: data, count };
    } catch (e) {
      throw e;
    }
  }

  @Post('/:commitmentId/comment')
  @UseGuards(JwtAuthGuard)
  async createCommitmentComments(@Param() param: CommitmentParam, @Body() dto: CreateCommentDto) {
    try {
      const { commitmentId } = param;
      const { context } = dto;

      const commitmentCommentInfo = await this.commentService.createComment(commitmentId, context);

      return { comment: commitmentCommentInfo };
    } catch (e) {
      throw e;
    }
  }
}
