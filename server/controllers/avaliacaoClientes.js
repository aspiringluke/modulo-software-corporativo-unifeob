import { conectar } from "../config/connection.js";
import { lerCredenciais } from "./secureStorage.js";
import { decrypt } from "../services/crypto.js";

export async function getAvaliacoesAtendimento(req, res)
{
    const senha = await lerCredenciais(req.session.usuario);
    const knex = conectar(req.session.usuario, senha);

    try {
        const results = await knex("avaliacaocliente").select("*").where('idproduto', null).andWhere('idvendedor', null);

        const quantidadeNotasAtendimento = {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0}
        let notas = results.forEach(n => {
            quantidadeNotasAtendimento[n.nota.toString()]++;
        });

        res.status(200).json({ "labels": ["1","2","3","4","5","6","7","8","9","10"], "notas": Object.values(quantidadeNotasAtendimento) });
    } catch (error) {
        console.log(error);
        res.status(500).json({erro: "Houve um problema ao conectar com o banco de dados: " + error});
    } finally {
        knex.destroy();
    }
}

export async function getAvaliacoesProdutos(req,res){
    const senha = await lerCredenciais(req.session.usuario);
    const knex = conectar(req.session.usuario, senha);

    try {
        const result = await knex("avaliacaocliente as a").select(["p.descricao", "a.nota"]).where("a.idproduto", "!=", null).join("produto as p", "p.idproduto", "a.idproduto");
        
        res.status(200).json({"labels": result.descricao, "notas": result.nota})
    } catch (error) {
        console.log(error);
        res.status(500).json({erro: "Houve um problema ao conectar com o banco de dados: " + error});
    }
}
export async function getAvaliacoesVendedores(req,res){}


export async function createAvaliacoes(req, res)
{
    const senha = await lerCredenciais(req.session.usuario);
    const knex = conectar(req.session.usuario, senha);

    try {
        const { nota, dataavaliacao, idcliente, tag, descricao, produto, vendedor } = req.body;
        const novaAvaliacao = {
            nota: parseInt(nota, 10),
            dataavaliacao: dataavaliacao,
            idcliente: parseInt(idcliente, 10),
            tag: parseInt(tag, 10),
            descricao: descricao,
            idproduto: produto,
            idvendedor: vendedor
        };

        await knex("avaliacaocliente").insert(novaAvaliacao);

        res.redirect('http://localhost:4040/relatorios');
    } catch (error) {
        res.render("nova_avaliacao", { erro: "Houve um problema ao salvar a avaliação: " + error.message });
    } finally {
        knex.destroy();
    }
}
