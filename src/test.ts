import { digest, score, generate_work } from "./index";
import { DATA, DIFFICULTY, SALT } from "./test-data";

("use strict");

it("Everything works", async () => {
  for (let i = 0; i < DATA.length; i++) {
    const d = DATA[i];
    try {
      const res = await digest(d.phrase);
      expect(res).toStrictEqual(d.hash);
      //expect(await w.digest(d.phrase)).toBe(d.hash);
      expect(score(d.hash)).toBe(d.difficulty);
      //let proof = await generate_work(SALT, d.phrase, DIFFICULTY);
      //console.log(
      //  `saved nonce:${d.pow.nonce} proof result: ${proof.result}proof nonce: ${proof.nonce}`
      //);
      //expect(proof.nonce).toBe(d.pow.nonce);
      //expect(proof.result).toBe(d.pow.result);
    } catch (error) {
      console.log(`${d.pow.nonce}${error}`);
      throw error;
    }
  }
});
