import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommitmentService } from './commitment.service';
import { CreateCommitmentDto } from './dto/create-commitment.dto';
import { Commitment } from './commitment.entity';
import { CommitmentParam } from './dto/commitment.param';

@Controller('commitment')
export class CommitmentController {
  constructor(private readonly commitmentService: CommitmentService) {}

  @Post('/')
  async createCommitment(@Body() dto: CreateCommitmentDto): Promise<any> {
    try {
      const { title, description, userId } = dto;
      const result: any = await this.createCommitment({
        title,
        description,
        userId,
      });

      return result;
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
