import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  APP_PIPE,
  Reflector,
} from '@nestjs/core';
import { ThrottlerModuleOptions, ThrottlerStorage } from '@nestjs/throttler';

import {
  CacheHeadersInterceptor,
  RedisCacheInterceptor,
} from '@/common/interceprors';
import { HttpExceptionFilter } from '@/common/exception-filters';
import { CacheAwareThrottlerGuard } from '@/common/guards';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { ProductsModule } from '@/modules/products/products.module';
import { CategoriesModule } from '@/modules/categories/categories.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { FavoritesModule } from '@/modules/favorites/favorites.module';
import { UsersController } from '@/modules/users/users.controller';
import { UsersModule } from '@/modules/users/users.module';
import { CartItemsModule } from '@/modules/cart-items/cart-items.module';
import { AddressesModule } from '@/modules/addresses/addresses.module';
import { PaymentModule } from '@/modules/payment/payment.module';
import { OrdersModule } from '@/modules/orders/orders.module';
import { MailModule } from '@/modules/mail/mail.module';
import { RedisModule } from '@/modules/redis/redis.module';
import { ThrottlerConfigModule } from '@/modules/throttler-config/throttler-config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MailModule,
    PrismaModule,
    ProductsModule,
    CategoriesModule,
    AuthModule,
    FavoritesModule,
    UsersModule,
    CartItemsModule,
    AddressesModule,
    PaymentModule,
    OrdersModule,
    RedisModule,
    ThrottlerConfigModule,
  ],
  controllers: [AppController, UsersController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useFactory: (reflector: Reflector) => {
        return new CacheHeadersInterceptor(reflector);
      },
      inject: [Reflector],
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (CACHE_MANAGER: Cache, reflector: Reflector) => {
        return new RedisCacheInterceptor(CACHE_MANAGER, reflector);
      },
      inject: ['CACHE_MANAGER', Reflector],
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
          enableDebugMessages: true,
        });
      },
    },
    {
      provide: APP_GUARD,
      useFactory: (
        cacheManager: Cache,
        options: ThrottlerModuleOptions,
        storageService: ThrottlerStorage,
        reflector: Reflector,
      ): CacheAwareThrottlerGuard => {
        return new CacheAwareThrottlerGuard(
          cacheManager,
          options,
          storageService,
          reflector,
        );
      },
      inject: [
        CACHE_MANAGER,
        'THROTTLER:MODULE_OPTIONS',
        ThrottlerStorage,
        Reflector,
      ],
    },
  ],
})
export class AppModule {}
