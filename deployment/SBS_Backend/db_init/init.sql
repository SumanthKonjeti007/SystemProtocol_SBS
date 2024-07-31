-- init.sql
CREATE TABLE IF NOT EXISTS user_roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(255) NOT NULL
);

INSERT INTO user_roles (role_id, role_name) VALUES (2, 'customer') ON CONFLICT (role_id) DO NOTHING;
INSERT INTO user_roles (role_id, role_name) VALUES (6, 'internal') ON CONFLICT (role_id) DO NOTHING;
INSERT INTO user_roles (role_id, role_name) VALUES (4, 'admin') ON CONFLICT (role_id) DO NOTHING;
INSERT INTO user_roles (role_id, role_name) VALUES (3, 'merchant') ON CONFLICT (role_id) DO NOTHING;
