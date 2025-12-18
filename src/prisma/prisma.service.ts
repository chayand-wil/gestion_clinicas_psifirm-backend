import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // Allow skipping DB connect in development/testing when you don't have the DB running.
    // Set SKIP_DB_CONNECT=true to skip the initial connect entirely.
    if (process.env.SKIP_DB_CONNECT === 'true') {
      // eslint-disable-next-line no-console
      console.warn('SKIP_DB_CONNECT is true — skipping Prisma $connect()');
      return;
    }

    const maxRetries = parseInt(process.env.PRISMA_CONNECT_RETRIES ?? '5', 10);
    const baseDelayMs = parseInt(process.env.PRISMA_CONNECT_BASE_DELAY_MS ?? '500', 10);
    let attempt = 0;

    while (true) {
      try {
        await this.$connect();
        // eslint-disable-next-line no-console
        console.log('Prisma connected to the database');
        return;
      } catch (err) {
        attempt += 1;
        // If we've exhausted retries, decide whether to throw or continue based on env
        if (attempt > maxRetries) {
          // eslint-disable-next-line no-console
          console.error(`Prisma failed to connect after ${maxRetries} attempts:`, err);
          if (process.env.SKIP_DB_CONNECT_ON_FAILURE === 'true') {
            // eslint-disable-next-line no-console
            console.warn('SKIP_DB_CONNECT_ON_FAILURE is true — continuing without a DB connection');
            return;
          }
          // Re-throw so the app fails fast in production-like scenarios
          throw err;
        }

        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        // eslint-disable-next-line no-console
        console.warn(`Prisma connect attempt ${attempt} failed, retrying in ${delay}ms...`);
        // wait before next attempt
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
