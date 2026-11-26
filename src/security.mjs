// The vault is deliberately independent of the UI and any cloud service.
export const FORMAT='manabi-vault-v2', ITERATIONS=600000;
const encoder=new TextEncoder(), decoder=new TextDecoder('utf-8',{fatal:true});
const cryptoApi=()=>{if(!globalThis.crypto?.subtle)throw Error('HTTPS と Web Crypto が必要です');return globalThis.crypto;};
const bytes=n=>cryptoApi().getRandomValues(new Uint8Array(n));
const b64=a=>{let s='';for(let i=0;i<a.length;i+=8192)s+=String.fromCharCode(...a.subarray(i,i+8192));return btoa(s);};
const un64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
export function isEnvelope(v){return !!v&&v.format===FORMAT&&v.kdf==='PBKDF2-SHA256'&&v.iterations===ITERATIONS&&typeof v.salt==='string'&&typeof v.iv==='string'&&typeof v.ciphertext==='string'&&v.salt.length===24&&v.iv.length===16&&v.ciphertext.length>=24&&v.ciphertext.length<=150000000;}
async function derive(password,salt){const c=cryptoApi();const input=await c.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveKey']);return c.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt,iterations:ITERATIONS},input,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
export async function newKey(password){if(typeof password!=='string'||password.length<12)throw Error('12文字以上のパスフレーズを設定してください');const salt=bytes(16);return {key:await derive(password,salt),salt:b64(salt)};}
export async function encrypt(data,session){const iv=bytes(12);const ciphertext=await cryptoApi().subtle.encrypt({name:'AES-GCM',iv,additionalData:encoder.encode(FORMAT)},session.key,encoder.encode(JSON.stringify(data)));return {format:FORMAT,kdf:'PBKDF2-SHA256',iterations:ITERATIONS,salt:session.salt,iv:b64(iv),ciphertext:b64(new Uint8Array(ciphertext))};}
export async function unlock(envelope,password){if(!isEnvelope(envelope))throw Error('非対応の保管庫形式です');const salt=un64(envelope.salt),iv=un64(envelope.iv);if(salt.length!==16||iv.length!==12)throw Error('保管庫形式が不正です');const session={salt:envelope.salt,key:await derive(password,salt)};const raw=await cryptoApi().subtle.decrypt({name:'AES-GCM',iv,additionalData:encoder.encode(FORMAT)},session.key,un64(envelope.ciphertext));return {session,data:JSON.parse(decoder.decode(raw))};}
