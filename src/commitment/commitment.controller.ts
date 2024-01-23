import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommitmentService } from './commitment.service';
import { CreateCommitmentDto } from './dto/create-commitment.dto';
import { Commitment } from './commitment.entity';
import { CommitmentParam } from './dto/commitment.param';
import { JwtAuthGuard } from 'src/security/jwt-auth.guard';
import { AuthUser } from 'src/security/auth-user.decorator';
import { User } from 'src/user/user.entity';

@Controller('commitment')
export class CommitmentController {
  constructor(private readonly commitmentService: CommitmentService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createCommitment(@Body() dto: CreateCommitmentDto, @AuthUser() user: User): Promise<any> {
    try {
      const { title } = dto;

      const createdCommitment: Commitment = await this.commitmentService.createCommitment({
        user,
        title,
      });

      return { commitment: createdCommitment };
    } catch (e) {
      throw e;
    }
  }

  @Get('/')
  async getCommitments(): Promise<any> {
    try {
      const result = await this.commitmentService.getCommitmentList();
      return result;
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
}
