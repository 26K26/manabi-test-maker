import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
if(!globalThis.crypto)Object.defineProperty(globalThis,'crypto',{value:webcrypto});
import {newKey,encrypt,unlock,isEnvelope} from '../src/security.mjs';
import {seed} from '../src/model.mjs';
test('encrypt roundtrip, unique IV, no plaintext, wrong password rejected',async()=>{
 const password='fictional test password 123',s=seed(),key=await newKey(password);
 const a=await encrypt(s,key),b=await encrypt(s,key);
 assert.ok(isEnvelope(a));assert.notEqual(a.iv,b.iv);assert.ok(!JSON.stringify(a).includes(s.title));
 assert.deepEqual((await unlock(a,password)).data,s);
 await assert.rejects(unlock(a,'wrong password'));
 const broken={...a,ciphertext:(a.ciphertext[0]==='A'?'B':'A')+a.ciphertext.slice(1)};
 await assert.rejects(unlock(broken,password));
});
test('reject short passwords and invalid format',async()=>{await assert.rejects(newKey('short'));assert.equal(isEnvelope({}),false);});
