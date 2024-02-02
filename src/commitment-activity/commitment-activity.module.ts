import { Module, forwardRef } from '@nestjs/common';
import { CommitmentActivityService } from './commitment-activity.service';
import { CommitmentActivityController } from './commitment-activity.controller';
import { CommitmentModule } from 'src/commitment/commitment.module';
import { CommitmentActivity } from './commitment-activity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Commitment } from 'src/commitment/commitment.entity';
import { UserCommitment } from 'src/commitment/user-commitment.entity';

@Module({
  imports: [forwardRef(() => CommitmentModule), UserModule, TypeOrmModule.forFeature([Commitment, CommitmentActivity, UserCommitment])],
  providers: [CommitmentActivityService],
  controllers: [CommitmentActivityController],
  exports: [CommitmentActivityService],
})
export class CommitmentActivityModule {}
