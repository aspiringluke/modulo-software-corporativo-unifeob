import knex from "knex";
import dotenv from "dotenv";


dotenv.config();

export function conectar(usuario, senha)
{
    try{
        const conexao = knex({
            client: "mysql2",
            connection: {
                host: process.env.DB_Host ?? "",
                port: parseInt(process.env.DB_PORT ?? ""),
                user: usuario,
                password: senha,
                database: process.env.DB_DATABASE
            },
        });
        return conexao;
    }catch(err) {
        throw new Error(`A conexao com o banco falhou: ${err}`);
    }

}