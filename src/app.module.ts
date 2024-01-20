import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { CommitmentModule } from './commitment/commitment.module';
import { CommentModule } from './comment/comment.module';
import { CommitmentActivityModule } from './commitment-activity/commitment-activity.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),
    UserModule,
    DatabaseModule,
    CommitmentModule,
    CommentModule,
    CommitmentActivityModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
