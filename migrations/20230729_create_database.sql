DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'pafin') THEN
        CREATE DATABASE pafin;
    END IF;
END $$;