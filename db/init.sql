-- Initialization script for postgres configuration

-- Create the uuid extension for uuidv4 unique data item IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create USER table
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
  -- CONSTRAINT user_umail_key UNIQUE (email),
  CONSTRAINT user_uname_key UNIQUE (username)
);

-- Create APPLICATION  table
CREATE TYPE appl_status AS ENUM ('In Progress', 'Pending', 'Completed', 'Rejected');

CREATE TABLE applications (
  id               uuid NOT NULL DEFAULT uuid_generate_v4(),
  usr_id           uuid NOT NULL,
  vehicle_id       uuid NOT NULL,
  seller_code      character varying(255) NOT NULL,
  buyer_code       character varying(255) NOT NULL,
  status           appl_status NOT NULL,
  date_created     timestamp without time zone DEFAULT timezone('eest'::text, now()),
  date_modified    timestamp without time zone DEFAULT timezone('eest'::text, now()),

  -- Keys
  -- Primary Key
  CONSTRAINT app_pkey PRIMARY KEY (id),

  -- Foreign
  CONSTRAINT app_user_fkey FOREIGN KEY (usr_id)
    REFERENCES users (id) MATCH SIMPLE
    ON DELETE CASCADE ON UPDATE CASCADE 
);

-- Create VEHICLE  table
CREATE TYPE vehicle_type AS ENUM ('Car', 'Motorcycle', 'Truck', 'Boat');

CREATE TABLE vehicles (
  id               uuid NOT NULL DEFAULT uuid_generate_v4(),
  vehicle_num      character varying(255) NOT NULL, -- plates
  certif_date      date,
  type             vehicle_type NOT NULL,

  -- Unique
  CONSTRAINT vehicle_vnum_key UNIQUE (vehicle_num)
);

