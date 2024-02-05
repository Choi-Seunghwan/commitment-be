import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommitmentParam } from 'src/commitment/dto/commitment.param';
import { CommitmentActivityService } from './commitment-activity.service';
import { JwtAuthGuard } from 'src/security/jwt-auth.guard';
import { AuthUser } from 'src/security/auth-user.decorator';
import { User } from 'src/user/user.entity';
import { UserCommitmentDto } from './dto/commitment-activity.dto';
import { CommitmentInfo, CommitmentType } from 'src/commitment/commitment.type';

@Controller('commitment-activity')
export class CommitmentActivityController {
  constructor(private readonly commitmentActivityService: CommitmentActivityService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getUserCommitments(@Body() dto: UserCommitmentDto, @AuthUser() user: User) {
    const { type, status } = dto;

    let commitmentInfos: CommitmentInfo[];
    if (type === CommitmentType.PERSONAL)
      commitmentInfos = await this.commitmentActivityService.getUserPersonalCommitments({ user, status });
    else if (type === CommitmentType.PUBLIC)
      commitmentInfos = await this.commitmentActivityService.getUserPublicCommitments({ user, status });

    return { commitments: commitmentInfos };
  }

  @Get('/:commitmentId')
  @UseGuards(JwtAuthGuard)
  async getUserCommitment(@Param() param: CommitmentParam, @AuthUser() user: User) {
    const { commitmentId } = param;
    const commitment = await this.commitmentActivityService.getUserCommitment(user, commitmentId);

    return { commitment };
  }

  @Post('/:commitmentId/renew')
  @UseGuards(JwtAuthGuard)
  async renewCommitment(@Param() param: CommitmentParam, @AuthUser() user: User) {
    const { commitmentId } = param;
    const renewCommitment = await this.commitmentActivityService.renewCommitment(commitmentId, user);

    return { commitment: renewCommitment };
  }

  @Post('/:commitmentId/complete')
  @UseGuards(JwtAuthGuard)
  async completeCommitment(@Param() param: CommitmentParam, @AuthUser() user: User) {
    const { commitmentId } = param;
    const completedCommitment = await this.commitmentActivityService.completeCommitment(commitmentId, user);

    return { commitment: completedCommitment };
  }
}
