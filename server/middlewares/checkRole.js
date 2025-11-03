export function checkRole(requiredRole){
    return (req, res, next) => {
        const roles = req.session.roles || [];

        if (roles.includes(requiredRole)) {
            next();
        } else{
            res.status(403).send('Sem permissão de acesso');
        }
    }
}