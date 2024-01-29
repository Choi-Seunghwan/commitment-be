import { Module } from '@nestjs/common';
import { CommitmentCommentController } from './commitment-comment.controller';
import { CommitmentCommentService } from './commitment-comment.service';
import { CommitmentComment } from './commitment-comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommitmentModule } from 'src/commitment/commitment.module';

@Module({
  imports: [TypeOrmModule.forFeature([CommitmentComment]), CommitmentModule],
  controllers: [CommitmentCommentController],
  providers: [CommitmentCommentService],
})
export class CommitmentCommentModule {}
