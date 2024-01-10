import { Module } from '@nestjs/common';
import { CommitmentActivityService } from './commitment-activity.service';
import { CommitmentActivityController } from './commitment-activity.controller';

@Module({
  providers: [CommitmentActivityService],
  controllers: [CommitmentActivityController]
})
export class CommitmentActivityModule {}
