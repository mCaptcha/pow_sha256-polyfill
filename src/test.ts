import { digest, score, generate_work } from "./index";
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
