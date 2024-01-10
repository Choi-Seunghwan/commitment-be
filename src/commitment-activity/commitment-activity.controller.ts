import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommitmentParam } from 'src/commitment/dto/commitment.param';
import { CommitmentActivityService } from './commitment-activity.service';

@Controller('commitment-activity')
export class CommitmentActivityController {
  constructor(
    private readonly commitmentActivityService: CommitmentActivityService,
  ) {}

  @Post('/:commitmentId')
  async joinCommitment(@Param() param: CommitmentParam, @Body() body) {
    const { commitmentId } = param;
    const { userId } = body;

    const result = await this.commitmentActivityService.joinCommitment(
      commitmentId,
      userId,
    );

    return result;
  }
}
