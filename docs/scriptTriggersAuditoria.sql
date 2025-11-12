-- trigger 'cliente'
CREATE TRIGGER auditoria_cliente
AFTER INSERT OR UPDATE OR DELETE ON cliente
FOR EACH ROW
EXECUTE FUNCTION auditoria();


-- trigger 'avaliacaoCliente'
CREATE TRIGGER auditoria_avaliacao
AFTER INSERT OR UPDATE OR DELETE ON avaliacaocliente
FOR EACH ROW
EXECUTE FUNCTION auditoria();

-- trigger 'venda'
CREATE TRIGGER auditoria_venda
AFTER INSERT OR UPDATE OR DELETE ON venda
FOR EACH ROW
EXECUTE FUNCTION auditoria();

-- trigger 'produto'
CREATE TRIGGER auditoria_produto
AFTER INSERT OR UPDATE OR DELETE ON produto
FOR EACH ROW
EXECUTE FUNCTION auditoria();

-- trigger 'contexto'
CREATE TRIGGER auditoria_contexto
AFTER INSERT OR UPDATE OR DELETE ON contexto
FOR EACH ROW
EXECUTE FUNCTION auditoria();

-- trigger 'vendedor'
CREATE TRIGGER auditoria_vendedor
AFTER INSERT OR UPDATE OR DELETE ON vendedor
FOR EACH ROW
EXECUTE FUNCTION auditoria();