import keytar from "keytar";

const service = "sistema-argenzio";

export async function salvarCredenciais(usuario, senha) {
  try {
    await keytar.setPassword(service, usuario, senha);
  } catch (err) {
    console.error("Erro ao salvar credenciais: ", err);
  }
}

export async function lerCredenciais(usuario) {
  try {
    return await keytar.getPassword(service, usuario);
  } catch (err) {
    console.error("Erro ao ler credenciais: ", err);
    return null;
  }
}

export async function removerCredenciais(usuario) {
  try {
    await keytar.deletePassword(service, usuario);
  } catch (err) {
    console.error("Erro ao remover credenciais: ", err);
  }
}
