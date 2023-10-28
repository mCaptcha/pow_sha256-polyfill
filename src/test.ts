import { digest, score, generate_work, stepped_generate_work } from "./index";
import { DATA, DIFFICULTY, SALT } from "./test-data";

("use strict");

test("Proof generation works", async () => {
  for (let i = 0; i < DATA.length; i++) {
    const d = DATA[i];
    try {
      const proof = await generate_work(SALT, d.phrase, DIFFICULTY);
      expect(proof.nonce).toBe(d.pow.nonce);
      expect(proof.result).toBe(`${d.pow.result}`);
    } catch (error) {
      console.log(`${d.pow.nonce}${error}`);
      throw error;
    }
  }
});

test("Digest works", async () => {
  for (let i = 0; i < DATA.length; i++) {
    const d = DATA[i];
    try {
      const res = await digest(d.phrase);
      expect(res).toStrictEqual(d.hash);
      expect(score(d.hash)).toBe(d.difficulty);
    } catch (error) {
      console.log(`${d.pow.nonce}${error}`);
      throw error;
    }
  }
});

test("Incremental proof generation works", async () => {
  for (let i = 0; i < DATA.length; i++) {
    const d = DATA[i];
    let last_nonce = 0;
    const step = 1000;
    let fnExecuted = false;
    const fn = (n: number): void => {
      expect(last_nonce + step).toBe(n);
      last_nonce = n;
      fnExecuted = true;
    };

    try {
      const proof = await stepped_generate_work(
        SALT,
        d.phrase,
        DIFFICULTY,
        1000,
        fn
      );
      expect(proof.nonce).toBe(d.pow.nonce);
      expect(proof.result).toBe(`${d.pow.result}`);
    } catch (error) {
      console.log(`${d.pow.nonce}${error}`);
      throw error;
    }
    expect(fnExecuted).toBeTruthy();
  }
});
