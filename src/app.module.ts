import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { CommitmentModule } from './commitment/commitment.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [UserModule, DatabaseModule, CommitmentModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
