import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommitmentService } from './commitment.service';
import { CreateCommitmentDto } from './dto/create-commitment.dto';
import { Commitment } from './commitment.entity';
import { CommitmentParam } from './dto/commitment.param';
import { JwtAuthGuard } from 'src/security/jwt-auth.guard';
import { AuthUser } from 'src/security/auth-user.decorator';
import { User } from 'src/user/user.entity';
import { CommitmentInfo } from './commitment.type';
import { OptionalJwtAuthGuard } from 'src/security/optional-jwt-auth.guard';

@Controller('commitment')
export class CommitmentController {
  constructor(private readonly commitmentService: CommitmentService) {}

  @Get('/')
  @UseGuards(OptionalJwtAuthGuard)
  async getPublicCommitments(@AuthUser() user: User): Promise<any> {
    try {
      const commitments = await this.commitmentService.getPublicCommitments(user);

      return { commitments };
    } catch (e) {
      throw e;
    }
  }

  @Get('/:commitmentId')
  async getCommitment(@Param() param: CommitmentParam): Promise<Commitment> {
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
      const { title, type, renewalPeriodDays } = dto;

      const createdCommitment: CommitmentInfo = await this.commitmentService.createCommitment({
        user,
        title,
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
  async joinCommitment(@Param() param: CommitmentParam, @AuthUser() user: User) {
    const { commitmentId } = param;
    const commitmentInfo = await this.commitmentService.joinCommitment(commitmentId, user);

    return { commitment: commitmentInfo };
  }

  @Post('/leave/:commitmentId')
  @UseGuards(JwtAuthGuard)
  async leaveCommitment(@Param() param: CommitmentParam, @AuthUser() user: User) {
    const { commitmentId } = param;
    const result = await this.commitmentService.leaveCommitment(commitmentId, user);
    return result;
  }
}
