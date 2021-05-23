-- APPLICATION  table

CREATE TABLE application (
  id               uuid NOT NULL DEFAULT uuid_generate_v4(),
  usr_id           uuid NOT NULL,
  vehicle_id       uuid NOT NULL,
  --sellerCode       character varying(255),
  buyerCode        character varying(255) NOT NULL,
  status           enum('In Progress', 'Pending', 'Completed', 'Rejected') NOT NULL,
  date_created     timestamp without time zone DEFAULT timezone('utc'::text, now()),
  date_modified    timestamp without time zone DEFAULT timezone('utc'::text, now()),

  -- Keys
  -- Primary Key
  CONSTRAINT app_pkey PRIMARY KEY (id),

  -- Foreign
  CONSTRAINT app_user_fkey FOREIGN KEY (usr_id)
    REFERENCES user (id) MATCH SIMPLE
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT app_vehicle_fkey FOREIGN KEY (vehicle_id)
    REFERENCES vehicle (id) MATCH SIMPLE
    ON DELETE CASCADE ON UPDATE CASCADE,

  -- Unique
--   CONSTRAINT app_uid_key UNIQUE (usr_id),
--   CONSTRAINT app_vid_key UNIQUE (vehicle_id),
  CONSTRAINT app_bcode_key UNIQUE (buyerCode)
  
);