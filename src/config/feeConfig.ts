// src/config/feeConfig.ts
// ──────────────────────────────────────────────────────────────────────────────
// Platform fee configuration.
//
// PLATFORM_FLAT_FEE  : flat charge per order (default $0.25)
//                      Set via .env: PLATFORM_FEE=0.25
//
// PESEPAY_FEE_PERCENT: Pesepay's processing fee as a percentage (default 2 %).
//                      We couldn't find the official rate on their site, so 2 %
//                      is used as a safe estimate — update anytime via .env:
//                      PESEPAY_FEE_PERCENT=2
//
// These are shown to the customer simply as "Tax Charges" — no processor name
// is exposed on the front-end.
// ──────────────────────────────────────────────────────────────────────────────

export const PLATFORM_FLAT_FEE    = parseFloat(process.env.PLATFORM_FEE         ?? '0.25');
export const PESEPAY_FEE_PERCENT  = parseFloat(process.env.PESEPAY_FEE_PERCENT   ?? '2');

/**
 * Calculates the fee breakdown for a given subtotal (before fees).
 *
 * @param subtotal - The cart total + shipping in USD (before fees)
 * @returns An object with the individual fee parts and the combined tax charge.
 *
 * Example (subtotal = $50):
 *   pesepayFee   = $50 × 2% = $1.00
 *   platformFee  = $0.25
 *   taxCharge    = $1.25
 *   grandTotal   = $51.25
 */
export function calculateFees(subtotal: number): {
  pesepayFee:  number;
  platformFee: number;
  taxCharge:   number;  // sum of pesepayFee + platformFee, labelled "Tax Charges" on frontend
  grandTotal:  number;  // subtotal + taxCharge
} {
  const pesepayFee  = parseFloat((subtotal * PESEPAY_FEE_PERCENT / 100).toFixed(2));
  const platformFee = PLATFORM_FLAT_FEE;
  const taxCharge   = parseFloat((pesepayFee + platformFee).toFixed(2));
  const grandTotal  = parseFloat((subtotal + taxCharge).toFixed(2));

  return { pesepayFee, platformFee, taxCharge, grandTotal };
}
