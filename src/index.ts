/*
 * mCaptcha is a PoW based DoS protection software.
 * This is the frontend web component of the mCaptcha system
 * Copyright © 2021 Aravinth Manivnanan <realaravinth@batsense.net>.
 *
 * Use of this source code is governed by Apache 2.0 or MIT license.
 * You should have received a copy of MIT and Apache 2.0 along with
 * this program. If not, see <https://spdx.org/licenses/MIT.html> for
 * MIT or <http://www.apache.org/licenses/LICENSE-2.0> for Apache.
 */

const U128_MAX = 340282366920938463463374607431768211455n;
const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8");

const length_metadata = (len: number): number[] => {
  return [
    (len & 0x00000000000000ff) >> 0,
    (len & 0x000000000000ff00) >> 8,
    (len & 0x0000000000ff0000) >> 16,
    (len & 0x00000000ff000000) >> 24,
    (len & 0x000000ff00000000) >> 32,
    (len & 0x0000ff000000000) >> 48,
    (len & 0x00ff00000000000) >> 56,
    Number((BigInt(len) & 0xff0000000000000n) >> BigInt(64)),
  ];
};

const serialize = (message: string): Uint8Array => {
  const len_encoded = length_metadata(message.length);
  const msgUint8 = new Uint8Array(
    len_encoded.concat(Array.from(encoder.encode(message)))
  );
  return msgUint8;
};

/**
 * Compute SHA-256 digest of a string
 * @param {string} message - a string on which hash needs to be computed
 * @returns {number[]} - byte array of the hash
 **/
export const digest = async (message: string): Promise<number[]> => {
  const msgUint8 = encoder.encode(message);

  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray;
};

/**
 * Calculate difficulty of  a hash
 *
 * @param {number[]} hash - hash for which difficulty should be calculated
 * @returns {BigInt} - difficulty of the given hash
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
 * Generate Proof-of-Work(PoW) according to the algorithm used in mCaptcha
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
  const serialized_phrase = decoder.decode(serialize(phrase));
  const base = salt + serialized_phrase;
  let nonce = 0;
  let result: BigInt = BigInt(0);
  const difficulty_new: BigInt = U128_MAX - U128_MAX / BigInt(difficulty);
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

/**
 * Generate Proof-of-Work(PoW) according to the algorithm used in mCaptcha incrementally
 *
 * @param {string} salt - salt used in PoW computation. Will be provided in PoW requirement
 * @param {string} phrase - challenge phrase used in PoW computation. Will be provided in PoW requirement
 * @param {number} difficulty - target difficulty for which PoW should be generated. Will be provided in PoW requirement
 * @param {number} step - notify progress with nonce after 'n' number of steps
 * @param {(nonce: number) => void} fn - callback function to notify progress 
 *
 * @returns {Promise<WasmWork>} - proof-of-work
 **/
export const stepped_generate_work = async (
  salt: string,
  phrase: string,
  difficulty: number,
  step: number,
  fn: (nonce: number) => void,
): Promise<WasmWork> => {
  const serialized_phrase = decoder.decode(serialize(phrase));
  const base = salt + serialized_phrase;
  let nonce = 0;
  let result: BigInt = BigInt(0);
  const difficulty_new: BigInt = U128_MAX - U128_MAX / BigInt(difficulty);
  let count = 0;
  while (result < difficulty_new) {
    if (count < step) {
      nonce += 1;
      const hash = await digest(base + nonce.toString());
      result = score(hash);
      count+=1;
    } else {
      fn(nonce);
      count = 0;
    }
  }

  const work: WasmWork = {
    result: result.toString(),
    nonce,
  };
  return work;
};
