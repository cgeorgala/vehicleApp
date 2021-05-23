-- VEHICLE  table

CREATE TABLE vehicle (
  id               uuid NOT NULL DEFAULT uuid_generate_v4(),
  vehicle_num      character varying(255) NOT NULL, -- plates
  certif_date      date,
  type             enum('Car', 'Motorcycle', 'Truck', 'Boat') NOT NULL,

  -- Keys
  -- Primary Key
  CONSTRAINT vehicle_pkey PRIMARY KEY (id),

  -- Unique
  CONSTRAINT vehicle_vnum_key UNIQUE (vehicle_num)

);