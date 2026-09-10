import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

export const RECOVERY_QUESTION = "What is a memorable word or phrase only you know?";

export function normalizeRecoveryAnswer(answer: string) {
  return answer.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
}

function derive(answer: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(normalizeRecoveryAnswer(answer), salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 },
      (error, key) => error ? reject(error) : resolve(key));
  });
}

export async function hashRecoveryAnswer(answer: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${(await derive(answer, salt)).toString("hex")}`;
}

export async function verifyRecoveryAnswer(answer: string, encoded: string | null) {
  const valid = encoded && /^[a-f0-9]{32}:[a-f0-9]{128}$/.test(encoded);
  const [salt, hash] = valid ? encoded.split(":") : ["0".repeat(32), "0".repeat(128)];
  const actual = await derive(answer, salt);
  return timingSafeEqual(actual, Buffer.from(hash, "hex")) && Boolean(valid);
}
