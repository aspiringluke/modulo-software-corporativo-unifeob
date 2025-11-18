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
        // o contexto seleciona quais dados enviar para o front
        // grafico -> labels e notas
        // descricoes -> todos os dados
        if(req.query.contexto === "grafico")
        {
            const result = await knex("avaliacaocliente as a")
                .select("p.descricao")
                .join("produto as p", "p.idproduto", "=", "a.idproduto")
                .avg("a.nota as notas")
                .groupBy("p.descricao")
                .orderBy("notas", "desc");

            const descricoes=[], notas=[];

            result.forEach(r => {
                descricoes.push(r.descricao);
                notas.push(r.notas);
            })
            res.status(200).json({"labels": descricoes, "notas": notas})
        }
        else if(req.query.contexto === "descricoes")
        {
            const results = await knex("avaliacaocliente as a")
                .select(["a.idavaliacao","a.nota","p.descricao as nomeProduto","a.descricao","c.nome","a.dataavaliacao"])
                .join("produto as p", "a.idproduto", "=", "p.idproduto")
                .join("cliente as c", "a.idcliente", "=", "c.idcliente")
                .orderBy("p.descricao", "asc");
            
            console.log(results);
            
            const idAvaliacao=[], nota=[], nomeProduto=[], descricao=[], nomeCliente=[], data=[];
            for(const r of results)
            {
                idAvaliacao.push(r.idavaliacao);
                nota.push(r.nota);
                nomeProduto.push(r.nomeProduto);
                descricao.push(r.descricao);
                nomeCliente.push(r.nome);
                data.push(r.dataavaliacao);
            }
            res.status(200).json({
                "idAvaliacao": idAvaliacao,
                "nota": nota,
                "nomeProduto": nomeProduto,
                "descricao": descricao,
                "nomeCliente": nomeCliente,
                "data": data
            });
        }
        else
        {
            res.status(400).json({"error": "Parâmetros inválidos"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({erro: "Houve um problema ao conectar com o banco de dados: " + error});
    }
}

export async function getAvaliacoesVendedores(req,res){
    const senha = await lerCredenciais(req.session.usuario);
    const knex = conectar(req.session.usuario, senha);

    try {
        const result = await knex("avaliacaocliente as a")
        .select("v.nome")
        .join("vendedor as v", "v.idvendedor", "=", "a.idvendedor")
        .avg("a.nota as notas")
        .groupBy("v.nome")
        .orderBy("notas", "desc");

        const nomes=[], notas=[];

        result.forEach(r => {
            nomes.push(r.nome);
            notas.push(r.notas);
        })

        res.status(200).json({"labels": nomes, "notas": notas})
    } catch (error) {
        console.log(error);
        res.status(500).json({erro: "Houve um problema ao conectar com o banco de dados: " + error});
    }
}


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
