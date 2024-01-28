import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommitmentParam } from 'src/commitment/dto/commitment.param';
import { CommitmentActivityService } from './commitment-activity.service';
import { JwtAuthGuard } from 'src/security/jwt-auth.guard';
import { AuthUser } from 'src/security/auth-user.decorator';
import { User } from 'src/user/user.entity';

@Controller('commitment-activity')
export class CommitmentActivityController {
  constructor(private readonly commitmentActivityService: CommitmentActivityService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getUserCommitments(@AuthUser() user: User) {
    const progressCommitments = await this.commitmentActivityService.getUserCommitments(user, true);
    const completedCommitments = await this.commitmentActivityService.getUserCommitments(user, false);

    return { progressCommitments, completedCommitments };
  }

  @Get('/:commitmentId')
  @UseGuards(JwtAuthGuard)
  async getUserCommitment(@Param() param: CommitmentParam, @AuthUser() user: User) {
    const { commitmentId } = param;
    const commitment = await this.commitmentActivityService.getUserCommitment(user, commitmentId);

    return { commitment };
  }

  @Post('/renew/:commitmentId')
  @UseGuards(JwtAuthGuard)
  async renewCommitment(@Param() param: CommitmentParam, @AuthUser() user: User) {
    const { commitmentId } = param;
    const renewCommitment = await this.commitmentActivityService.renewCommitment(commitmentId, user);

    return { commitment: renewCommitment };
  }

  @Post('/complete/:commitmentId')
  @UseGuards(JwtAuthGuard)
  async completeCommitment(@Param() param: CommitmentParam, @AuthUser() user: User) {
    const { commitmentId } = param;
    const completedCommitment = await this.commitmentActivityService.completeCommitment(commitmentId, user);

    return { commitment: completedCommitment };
  }
}
