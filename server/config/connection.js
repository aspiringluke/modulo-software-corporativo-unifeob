import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

export function conectar(usuario, senha)
{
    const conexao = knex({
        client: "pg",
        connection: {
            host: process.env.DB_HOST ?? "",
            port: parseInt(process.env.DB_PORT ?? ""),
            user: usuario,
            password: senha,
            database: process.env.DB_DATABASE,
        },
    });
    return conexao;
}