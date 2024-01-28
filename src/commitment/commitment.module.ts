import { Module, forwardRef } from '@nestjs/common';
import { CommitmentService } from './commitment.service';
import { CommitmentController } from './commitment.controller';
import { Commitment } from './commitment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { CommitmentActivityModule } from 'src/commitment-activity/commitment-activity.module';
import { UserCommitment } from './user-commitment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Commitment, UserCommitment]), UserModule, forwardRef(() => CommitmentActivityModule)],
  providers: [CommitmentService],
  controllers: [CommitmentController],
  exports: [CommitmentService],
})
export class CommitmentModule {}
