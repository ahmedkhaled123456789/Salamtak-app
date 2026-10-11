import * as Crypto from 'expo-crypto';

/** Idempotency keys for booking creation — one per wizard session. */
export function newIdempotencyKey(): string {
  return `mob-${Crypto.randomUUID()}`;
}
