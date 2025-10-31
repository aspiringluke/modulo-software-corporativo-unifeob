async function generateKey(length=256)
{
    const cp = globalThis.crypto;
    const key = await cp.subtle.generateKey({ name: "AES-CBC", length }, true, ["encrypt", "decrypt"]);
    return key;
}

export async function encrypt(data)
{
    const cp = globalThis.crypto;
    const ec = new TextEncoder();
    const iv = cp.getRandomValues(new Uint8Array(16));
    const key = await generateKey();
    
    const criptografado = await cp.subtle.encrypt({name:'AES-CBC', iv}, key, ec.encode(data));

    return { criptografado, iv, key } ;
}

export async function decrypt(data, key, iv)
{
    const cp = globalThis.crypto;
    const dec = new TextDecoder();

    const plaintext = await cp.subtle.decrypt({name: 'AES-CBC', iv}, key, data);

    return dec.decode(plaintext);
}