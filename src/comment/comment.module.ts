import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommitmentModule } from 'src/commitment/commitment.module';
import { CommitmentComment } from './commitment-comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [CommitmentModule, TypeOrmModule.forFeature([CommitmentComment])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
