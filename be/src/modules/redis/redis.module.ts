import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

import { verbose } from '@/utils/helper';
import { DEFAULT_REDIS_CACHE_TTL } from '@/utils/static';

import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST');
        const port = configService.get<number>('REDIS_PORT');

        if (!host || !port) {
          throw new Error(
            `❌ Redis configuration missing! REDIS_HOST: ${host}, REDIS_PORT: ${port}. ` +
              'Check that .env file exists and contains REDIS_HOST and REDIS_PORT.',
          );
        }

        verbose(() =>
          console.log('🔌 Connecting to Redis at:', {
            host,
            port,
            database: 0,
          }),
        );

        try {
          const store = createKeyv(`redis://${host}:${port}/0`);

          verbose(() =>
            console.log(
              '✅ Redis store created successfully using @keyv/redis!',
            ),
          );
          verbose(() =>
            console.log(
              '   Connection URL: redis://' + host + ':' + port + '/0',
            ),
          );

          return {
            stores: [store],
            ttl: DEFAULT_REDIS_CACHE_TTL, // Default TTL: 60 seconds (in milliseconds)
          };
        } catch (error) {
          console.error('❌ Failed to connect to Redis:', error);
          throw new Error(
            `Failed to connect to Redis at ${host}:${port}. ` +
              'Ensure Redis is running and accessible.',
          );
        }
      },
    }),
  ],
  controllers: [RedisController],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
