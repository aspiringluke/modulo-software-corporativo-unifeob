CREATE OR REPLACE FUNCTION auditoria()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO log_auditoria (tabela, operacao, registro_antigo, registro_novo, usuario)
        VALUES (TG_TABLE_NAME, 'DELETE', to_jsonb(OLD), NULL, current_user);
        RETURN OLD;

    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO log_auditoria (tabela, operacao, registro_antigo, registro_novo, usuario)
        VALUES (TG_TABLE_NAME, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), current_user);
        RETURN NEW;

    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO log_auditoria (tabela, operacao, registro_antigo, registro_novo, usuario)
        VALUES (TG_TABLE_NAME, 'INSERT', NULL, to_jsonb(NEW), current_user);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;