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
    const activatedCommitments = await this.commitmentActivityService.getUserCommitments(user, true);
    const inActivatedCommitments = await this.commitmentActivityService.getUserCommitments(user, false);

    return { activatedCommitments, inActivatedCommitments };
  }

  @Post('/renew/:commitmentId')
  @UseGuards(JwtAuthGuard)
  async renewCommitment(@Param() param: CommitmentParam, @AuthUser() user: User) {
    const { commitmentId } = param;
    const renewCommitment = await this.commitmentActivityService.renewCommitment(commitmentId, user);

    return { commitment: renewCommitment };
  }

  @Post('/join/:commitmentId')
  @UseGuards(JwtAuthGuard)
  async joinCommitment(@Param() param: CommitmentParam, @AuthUser() user: User) {
    const { commitmentId } = param;
    const joinedCommitment = await this.commitmentActivityService.joinCommitment(commitmentId, user);

    return { commitment: joinedCommitment };
  }

  @Post('/complete/:commitmentId')
  @UseGuards(JwtAuthGuard)
  async completeCommitment(@Param('commitmentId') commitmentId: string, @AuthUser() user: User) {
    const completedCommitment = await this.commitmentActivityService.completeCommitment(commitmentId, user);

    return { commitment: completedCommitment };
  }
}
