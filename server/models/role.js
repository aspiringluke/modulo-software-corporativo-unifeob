import { conectar } from "../config/connection.js";

export async function getUserRole(user, password){
    const knex = conectar(user, password);
    const rolename = await knex('pg_roles as r')
    .join('pg_auth_members as m', 'r.oid', 'm.roleid')
    .join('pg_roles as u', 'u.oid', 'm.member')
    .where('u.rolname', user)
    .select('r.rolname');

    await knex.destroy();
    return rolename.map(r => r.rolname);
}