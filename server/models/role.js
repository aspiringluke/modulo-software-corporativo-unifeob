import { conectar } from "../config/connection.js";

export async function getUserRole(user, password){
    const knex = conectar(user, password);
    const rolename = await knex.raw(
        `SELECT r.rolname
        FROM pg_roles r
        JOIN pg_auth_members m ON r.oid = m.roleid
        JOIN pg_roles u ON u.oid = m.member
        WHERE u.rolname = ?;`, [user]
    );
    await knex.destroy();
    return rolename.rows.map(r => r.rolname);
}