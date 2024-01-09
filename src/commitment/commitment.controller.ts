import { Controller, Get } from '@nestjs/common';
import { CommitmentService } from './commitment.service';

@Controller('commitment')
export class CommitmentController {
  constructor(private readonly commitmentService: CommitmentService) {}

  @Get('/')
  async getCommitments(): Promise<any> {
    const result = await this.commitmentService.getCommitmentList();
    return result;
  }
}
