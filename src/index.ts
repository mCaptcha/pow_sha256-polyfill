/*
 * mCaptcha is a PoW based DoS protection software.
 * This is the frontend web component of the mCaptcha system
 * Copyright © 2021 Aravinth Manivnanan <realaravinth@batsense.net>.
 *
 * Use of this source code is governed by Apache 2.0 or MIT license.
 * You shoud have received a copy of MIT and Apache 2.0 along with
 * this program. If not, see <https://spdx.org/licenses/MIT.html> for
 * MIT or <http://www.apache.org/licenses/LICENSE-2.0> for Apache.
 */

const U128_MAX = 340282366920938463463374607431768211455n;

/**
 * Compute SHA-256 digest of a string
 * @param {string} message - a string on which hash needs to be computed
 * @returns {number[]} - byte array of the hash
 **/
export const digest = async (message: string): Promise<number[]> => {
  const msgUint8 = new TextEncoder().encode(message);
  msgUint8;
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray;
};

/**
 * Calculate difficulty of  a hash
 *
 * @param {number[]} hash - hash for which difficulty should be calculated
 * @returns {BigInt} - diffuclty of the given hash
 */
export const score = (hash: number[]): BigInt => {
  let sum = BigInt(0);

  for (let i = 15; i >= 0; i--) {
    sum += 256n ** BigInt(16 - (i + 1)) * BigInt(hash[i]);
  }

  return sum;
};

/**
 * Datatype describing a Proof-of-Work object
 *
 **/
export type WasmWork = {
  /** proof solution's difficulty **/
  result: string;
  /** cryptographic nonce used in proof solution **/
  nonce: number;
};

/**
 * Generate Proof-of-Work(PoW) according to the algorithim used in mCaptcha
 *
 * @param {string} salt - salt used in PoW computation. Will be provided in PoW requirement
 * @param {string} phrase - challenge phrase used in PoW computation. Will be provided in PoW requirement
 * @param {number} difficulty - target difficulty for which PoW should be generated. Will be provided in PoW requirement
 *
 * @returns {Promise<WasmWork>} - proof-of-work
 **/
export const generate_work = async (
  salt: string,
  phrase: string,
  difficulty: number
): Promise<WasmWork> => {
  const base = salt + phrase;
  let nonce = 0;
  let result: BigInt = BigInt(0);
  const difficulty_new = U128_MAX - (U128_MAX / BigInt(difficulty));
  console.log(difficulty_new==340275561273600044694105339939619576091n);
  while (result < difficulty_new) {
    nonce += 1;
    const hash = await digest(base + nonce.toString());
    result = score(hash);
  }

  const work: WasmWork = {
    result: result.toString(),
    nonce,
  };
  return work;
};
