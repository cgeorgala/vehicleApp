-- VEHICLE  table

CREATE TYPE vehicle_type AS ENUM ('Car', 'Motorcycle', 'Truck', 'Boat');

CREATE TABLE vehicles (
  id               uuid NOT NULL DEFAULT uuid_generate_v4(),
  vehicle_num      character varying(255) NOT NULL, -- plates
  certif_date      date,
  type             vehicle_type NOT NULL,

  -- Keys
  -- Primary Key
  -- CONSTRAINT vehicle_pkey PRIMARY KEY (id), --TODO: ERROR:  relation "vehicles" does not exist

  -- Unique
  CONSTRAINT vehicle_vnum_key UNIQUE (vehicle_num)

);