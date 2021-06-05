-- APPLICATION  table

CREATE TYPE appl_status AS ENUM ('In Progress', 'Pending', 'Completed', 'Rejected');

CREATE TABLE applications (
  id               uuid NOT NULL DEFAULT uuid_generate_v4(),
  usr_id           uuid NOT NULL,
  vehicle_id       uuid NOT NULL,
  seller_code      character varying(255) NOT NULL,
  buyer_code       character varying(255) NOT NULL,
  status           appl_status NOT NULL,
  date_created     timestamp without time zone DEFAULT timezone('utc'::text, now()),
  date_modified    timestamp without time zone DEFAULT timezone('utc'::text, now()),

  -- Keys
  -- Primary Key
  CONSTRAINT app_pkey PRIMARY KEY (id),

  -- Foreign
  CONSTRAINT app_user_fkey FOREIGN KEY (usr_id)
    REFERENCES users (id) MATCH SIMPLE
    ON DELETE CASCADE ON UPDATE CASCADE

--TODO: ERROR:  relation "vehicles" does not exist
  -- CONSTRAINT app_vehicle_fkey FOREIGN KEY (vehicle_id)
  --   REFERENCES vehicles (id) MATCH SIMPLE
  --   ON DELETE CASCADE ON UPDATE CASCADE,

  -- Unique
--   CONSTRAINT app_uid_key UNIQUE (usr_id),
--   CONSTRAINT app_vid_key UNIQUE (vehicle_id),
  -- CONSTRAINT app_bcode_key UNIQUE (buyerCode)
  
);