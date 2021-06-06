-- USER  table

CREATE TYPE usr_role AS ENUM ('citizen', 'employee');

CREATE TABLE users(
  id               uuid NOT NULL DEFAULT uuid_generate_v4(),
  first_name       character varying(255) NOT NULL,
  last_name        character varying(255) NOT NULL,
  email            character varying(255) NOT NULL,
  username         character varying(20) NOT NULL,
  password         character varying(20) NOT NULL,
  role             usr_role NOT NULL,
  position         character varying(50),
  registrationCode character varying(255),

  -- Keys
  -- Primary Key
  CONSTRAINT user_pkey PRIMARY KEY (id),

  -- Unique
  CONSTRAINT user_umail_key UNIQUE (email),
  CONSTRAINT user_uname_key UNIQUE (username)
);