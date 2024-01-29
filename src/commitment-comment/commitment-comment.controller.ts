import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CommitmentCommentService } from './commitment-comment.service';
import { JwtAuthGuard } from 'src/security/jwt-auth.guard';
import { AuthUser } from 'src/security/auth-user.decorator';
import { CommitmentCommentDto, UpdateCommitmentCommentParam } from './dto/commitment-comment.param';
import { User } from 'src/user/user.entity';
import { CommitmentParam } from 'src/commitment/dto/commitment.param';

@Controller('commitments/:commitmentId/comments')
export class CommitmentCommentController {
  constructor(private commentService: CommitmentCommentService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createComment(@Param() param: CommitmentParam, @AuthUser() user: User, @Body() dto: CommitmentCommentDto) {
    const { commitmentId } = param;
    const { content } = dto;
    const comment = await this.commentService.createComment(commitmentId, user, content);

    return { comment };
  }

  @Get('/')
  async getComments(@Param() param: CommitmentParam) {
    const { commitmentId } = param;
    const comments = await this.commentService.getCommitments(commitmentId);

    return { comments };
  }

  @Put('/:commentId')
  @UseGuards(JwtAuthGuard)
  async updateComment(@Param() param: UpdateCommitmentCommentParam, @AuthUser() user: User, @Body() dto: CommitmentCommentDto) {
    const { commitmentId, commentId } = param;
    const { content } = dto;
    const comments = await this.commentService.updateComment(commitmentId, commentId, user, content);

    return { comments };
  }
}
