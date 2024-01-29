import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommitmentActivity } from 'src/commitment-activity/commitment-activity.entity';
import { CommitmentHistory } from 'src/commitment/commitment-history.entity';
import { Commitment } from 'src/commitment/commitment.entity';
import { UserCommitment } from 'src/commitment/user-commitment.entity';
import {
  ENV_DATABASE_HOST,
  ENV_DATABASE_NAME,
  ENV_DATABASE_PASSWORD,
  ENV_DATABASE_PORT,
  ENV_DATABASE_TYPE,
  ENV_DATABASE_USERNAME,
} from 'src/constants';
import { User } from 'src/user/user.entity';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: configService.get<DATABASE_TYPE_STR>(ENV_DATABASE_TYPE),
        host: configService.get<string>(ENV_DATABASE_HOST),
        database: configService.get<string>(ENV_DATABASE_NAME),
        port: Number(configService.get<string>(ENV_DATABASE_PORT)),
        entities: [User, Commitment, CommitmentActivity, CommitmentHistory, UserCommitment],
        username: configService.get<string>(ENV_DATABASE_USERNAME),
        password: configService.get<string>(ENV_DATABASE_PASSWORD),
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
