import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { AppModule } from './app.module';

async function bootstrap() {
  const host =
    process.env.DOMAIN_NAME && process.env.DOMAIN_COMMON
      ? `${process.env.DOMAIN_NAME}.${process.env.DOMAIN_COMMON}`
      : 'localhost';

  // https
  const httpsOptions = {
    key: readFileSync(join(__dirname, '..', 'cert', `${host}-key.pem`)),
    cert: readFileSync(join(__dirname, '..', 'cert', `${host}.pem`)),
    allowHTTP1: true,
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  // disable etag generation
  // (app.getHttpAdapter().getInstance() as Express).set('etag', false);

  // enable cookie parser
  app.use(cookieParser());

  // enable CORS
  app.enableCors({
    origin: process.env.DOMAINS_ALLOWED?.split(',') ?? undefined,
    allowedHeaders: [
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Allow-Origin',
      'Accept',
      'Cache-Control',
      'Content-Type',
      'Access-Control-Allow-Credentials',
      'Authorization',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    credentials: true,
  });

  // setup swagger
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000, host);
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});

/*
TODO:
+ add cart_items apis (user)
+ add addresses apis (user)
+ payment_methods, payment_method_translations apis (admin) | mirror the "categories" structure
+ add payments apis (user)
+ add orders, order_items apis (user) | after cart_items, addresses, payments are done

- modify the products, product_translations, product_images apis (admin); mirror the "categories" structure | SKIP for now
- shipping, shipping_methods, shipping_method_translations apis | SKIP for now
- make /me api (user)
- make /forgot-password, /reset-password, /change-password, /verify-email, /resend-verification api (user)

- use k8s
- add each app to docker
- add nginx as a reverse proxy

+ setup prisma studio
- add diff sign-in strategies (auth, basic, etc.)? | SKIP for now
+ add cache (redis)
+ https
- add http2 | SKIP for now
+ add http headers on api responses
+ add rate limiting https://docs.nestjs.com/security/rate-limiting
- add SSE (Server-Sent Events)?
- add websockets (chat, notifications, etc.)?
- add queues (bull, rabbitmq, etc.) | maybe some new table + microservice?
+ make pipe to convert to snake_case on input and to camelCase on output
+ send emails (verification, password reset, notifications) | use nodemailer + some smtp service | Resend
+ server app (nest js) | api.[example.com]
+ auth app (separate app, diff domain) | reactjs + vite (SPO) | auth.[example.com]
- main shop app (separate app, diff domain) | next js
- admin panel (separate app, diff domain) | vue or angular
- user profile app (separate app, diff domain) | vue or angular
- mobile app (separate app) | react native?
+ setup domains (auth, shop, admin app, user profile app, api)
- use RTK for app?
+ setup cors in nest js
- federation, SSO (+), keep seamless SSO between auth., app., admin., profile. etc.
- add small express app with all kind of apis | need to think about it

ORDER FLOW:
1. user adds items to cart (cart_items)
2. user places an order, clicking /checkout (orders, order_items)
3. cart_items copied to order_items, cart_items cleared
4. user works with order details (order_items), items can be removed or added from order_items, related to order
5. user finish order, checkout closes
6. if user clears order_items before finishing order, checkout is closed as well

REDIS:
+ Кешуй всі GET через Redis (ключ = URL + query)

RATE LIMIT: https://docs.nestjs.com/security/rate-limiting
- Додай rate limiting по IP або userId
- Встанови окремі ліміти для:
- GET (~100 запитів/хв)
- POST/PUT/DELETE (~10 запитів/хв)
- Винеси білд-запити (Next.js) в окрему категорію (X-Internal-Request)

HOSTS: (C:\Windows\System32\drivers\etc\hosts)
+ api.[example.com] - nest js (single microservice, single db)
+ auth.[example.com] - login app (SPO, react js?)
- app.[example.com] - next js, (main shop app)
- admin.[example.com] - angular app (CRUD products, categories, payments, orders)
- profile.[example.com] - vue js app (CRUD user data, favorites, addresses, cart items)
*/
