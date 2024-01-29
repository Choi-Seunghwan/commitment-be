import { Module } from '@nestjs/common';
import { CommitmentCommentController } from './commitment-comment.controller';
import { CommitmentCommentService } from './commitment-comment.service';
import { CommitmentComment } from './commitment-comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CommitmentComment])],
  controllers: [CommitmentCommentController],
  providers: [CommitmentCommentService],
})
export class CommitmentCommentModule {}
