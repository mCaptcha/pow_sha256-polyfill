<div align="center">

  <h1>PoW JavaScript library</h1>

<strong>JavaScript library to generate PoW for mCaptcha</strong>

[![0.1.0](https://img.shields.io/badge/TypeScript_docs-master-2b7489)](https://mcaptcha.github.io/pow_sha256-polyfill/)
![Build)](<https://github.com/mCaptcha/pow_sha256-polyfill/workflows/CI%20(Linux)/badge.svg>)
[![codecov](https://codecov.io/gh/mCaptcha/pow_sha256-polyfill/branch/master/graph/badge.svg)](https://codecov.io/gh/mCaptcha/pow_sha256-polyfill)

</div>

## Usage

To generate proof-of-work, per mCaptcha specification:

```typescript
import {generate_proof} from "@mcaptcha/pow_sha256-polyfill";

let salt = "randomsaltvalueprovidedbymcaptcha";
let phrase = "randomphrasevalueprovidedbymcaptcha";
let difficulty = 50_000;

let work = await generate_proof(salt, phrase, difficulty);
```

## Funding

### NLnet

<div align="center">
	<img
		height="150px"
		alt="NLnet NGIZero logo"
		src="./static/third-party/NGIZero-green.hex.svg"
	/>
</div>

<br />

2023 development is funded through the [NGI0 Entrust
Fund](https://nlnet.nl/entrust), via [NLnet](https://nlnet.nl/). Please
see [here](https://nlnet.nl/project/mCaptcha/) for more details.
