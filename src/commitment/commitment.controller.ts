import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommitmentService } from './commitment.service';
import { CreateCommitmentDto } from './dto/create-commitment.dto';
import { Commitment } from './commitment.entity';
import { CommitmentIdParam, CommitmentParam } from './dto/commitment.param';
import { JwtAuthGuard } from 'src/security/jwt-auth.guard';
import { AuthUser } from 'src/security/auth-user.decorator';
import { User } from 'src/user/user.entity';
import { CommitmentInfo } from './commitment.type';
import { OptionalJwtAuthGuard } from 'src/security/optional-jwt-auth.guard';
import { COMMITMENT_PARAM_TYPE } from './commitment.constant';

@Controller('commitment')
export class CommitmentController {
  constructor(private readonly commitmentService: CommitmentService) {}

  @Get('/')
  @UseGuards(OptionalJwtAuthGuard)
  async getPublicCommitments(@AuthUser() user: User, @Param() param: CommitmentParam): Promise<any> {
    try {
      const { type } = param;
      let result;

      switch (type) {
        case COMMITMENT_PARAM_TYPE.LATEST: {
          result = await this.commitmentService.getLatestPublicCommitments({ user, ...param });
          break;
        }
        case COMMITMENT_PARAM_TYPE.POPULAR: {
          result = await this.commitmentService.getPublicCommitments({ user, ...param });
          break;
        }
      }

      return {};
    } catch (e) {
      throw e;
    }
  }

  @Get('/:commitmentId')
  async getCommitment(@Param() param: CommitmentIdParam): Promise<Commitment> {
    try {
      const { commitmentId } = param;
      const result = await this.commitmentService.getCommitment(commitmentId);

      return result;
    } catch (e) {
      throw e;
    }
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createCommitment(@Body() dto: CreateCommitmentDto, @AuthUser() user: User): Promise<any> {
    try {
      const { title, description, type, renewalPeriodDays } = dto;

      const createdCommitment: CommitmentInfo = await this.commitmentService.createCommitment({
        user,
        title,
        description,
        type,
        renewalPeriodDays,
      });

      return { commitment: createdCommitment };
    } catch (e) {
      throw e;
    }
  }

  @Post('/join/:commitmentId')
  @UseGuards(JwtAuthGuard)
  async joinCommitment(@Param() param: CommitmentIdParam, @AuthUser() user: User) {
    const { commitmentId } = param;
    const commitmentInfo = await this.commitmentService.joinCommitment(commitmentId, user);

    return { commitment: commitmentInfo };
  }

  @Post('/leave/:commitmentId')
  @UseGuards(JwtAuthGuard)
  async leaveCommitment(@Param() param: CommitmentIdParam, @AuthUser() user: User) {
    const { commitmentId } = param;
    const result = await this.commitmentService.leaveCommitment(commitmentId, user);
    return result;
  }
}
