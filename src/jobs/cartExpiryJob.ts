// src/jobs/cartExpiryJob.ts
// ──────────────────────────────────────────────────────────────────────────────
// Cart Expiry Background Job
//
// Items added to cart but NOT purchased within 24 hours are automatically
// removed and their stock quantity is restored back to the product.
//
// This prevents "phantom stock" where products appear out-of-stock because
// someone added them to cart but never bought them.
//
// Runs every 30 minutes.
// ──────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CART_EXPIRY_HOURS = 24;
const JOB_INTERVAL_MS   = 30 * 60 * 1000; // 30 minutes

export async function runCartExpiryOnce(): Promise<void> {
  const expiryThreshold = new Date(Date.now() - CART_EXPIRY_HOURS * 60 * 60 * 1000);

  // Find all expired cart items (added more than 24 h ago)
  const expiredItems = await prisma.cart.findMany({
    where: {
      created_at: { lt: expiryThreshold },
    },
    include: {
      products: {
        select: { id: true, name: true, stock_quantity: true },
      },
    },
  });

  if (expiredItems.length === 0) {
    return; // Nothing to do
  }

  console.log(`🕐 Cart expiry job: processing ${expiredItems.length} expired item(s)...`);

  let restored = 0;
  let failed   = 0;

  for (const item of expiredItems) {
    try {
      await prisma.$transaction([
        // 1. Restore stock
        prisma.products.update({
          where: { id: item.product_id! },
          data: {
            stock_quantity: { increment: item.quantity },
            updated_at:     new Date(),
          },
        }),
        // 2. Remove the expired cart item
        prisma.cart.delete({
          where: { id: item.id },
        }),
      ]);

      console.log(
        `  ✅ Cart item #${item.id} expired — restored ${item.quantity}× ` +
        `"${item.products?.name ?? 'unknown'}" to stock`
      );
      restored++;
    } catch (err: any) {
      console.error(`  ❌ Failed to expire cart item #${item.id}:`, err.message);
      failed++;
    }
  }

  console.log(`🕐 Cart expiry job complete. Restored: ${restored} | Failed: ${failed}`);
}

/**
 * Starts the recurring cart expiry background job.
 * Call this once during server startup (in src/index.ts).
 */
export function startCartExpiryJob(): void {
  console.log(
    `🕐 Cart expiry job started — checking every 30 min for items older than ${CART_EXPIRY_HOURS}h`
  );

  // Run immediately on startup, then every 30 minutes
  runCartExpiryOnce().catch((err) =>
    console.error('Cart expiry job error on startup:', err)
  );

  setInterval(() => {
    runCartExpiryOnce().catch((err) =>
      console.error('Cart expiry job error:', err)
    );
  }, JOB_INTERVAL_MS);
}
