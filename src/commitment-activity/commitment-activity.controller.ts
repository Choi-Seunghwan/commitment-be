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
    const result = await this.commitmentActivityService.getUserCommitments(user);
  }

  @Post('/:commitmentId')
  @UseGuards(JwtAuthGuard)
  async joinCommitment(@Param() param: CommitmentParam, @AuthUser() user: User) {
    const { commitmentId } = param;

    const result = await this.commitmentActivityService.joinCommitment(commitmentId, user);

    return result;
  }
}
