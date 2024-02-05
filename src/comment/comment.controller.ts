import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class CommentController {
  @Get('/:commitmentId/comment')
  async getCommitmentComments(): Promise<any> {
    try {
    } catch (e) {
      throw e;
    }
  }
}
