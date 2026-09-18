-- SafeExit Grundschema.
--
-- Leitgedanke: Standortdaten liegen ausschliesslich in alarm_locations und nirgends
-- sonst. Nur so laesst sich das Versprechen aus dem Businessplan (Loeschung nach 24
-- Stunden, keine Bewegungshistorie) mit einer einzigen DELETE-Anweisung einhalten.

create table households (
    id uuid primary key,
    name text not null,
    created_at timestamptz not null default now()
);

create table partners (
    id uuid primary key,
    name text not null,
    street text not null,
    postal_code text not null,
    city text not null,
    latitude double precision not null,
    longitude double precision not null,
    status text not null check (status in ('pending', 'active')),
    created_at timestamptz not null default now()
);

-- Vorfilter fuer die Umkreissuche. Die genaue Entfernung rechnet das Backend.
create index partners_position_idx on partners (latitude, longitude) where status = 'active';

create table devices (
    id uuid primary key,
    serial text not null unique,
    type text not null check (type in ('button', 'station_home', 'station_partner')),
    wearer_name text not null,
    household_id uuid references households (id) on delete set null,
    partner_id uuid references partners (id) on delete set null,
    -- Geraetegeheimnis und PIN liegen nur als scrypt-Hash vor.
    secret_hash text not null,
    cancel_pin_hash text,
    firmware_version text,
    battery_percent smallint check (battery_percent between 0 and 100),
    last_seen_at timestamptz,
    created_at timestamptz not null default now()
);

create index devices_household_idx on devices (household_id);

-- Die Station eines Partnerbetriebs. Nachtraeglich, weil devices auf partners zeigt.
alter table partners
    add column station_device_id uuid references devices (id) on delete set null;

create table contacts (
    id uuid primary key,
    household_id uuid not null references households (id) on delete cascade,
    name text not null,
    phone text,
    push_token text,
    station_device_id uuid references devices (id) on delete set null,
    -- Kleinere Zahl heisst: wird zuerst benachrichtigt.
    priority int not null default 10,
    created_at timestamptz not null default now()
);

create index contacts_household_idx on contacts (household_id, priority);

create table alarms (
    id uuid primary key,
    device_id uuid not null references devices (id) on delete cascade,
    level smallint not null check (level between 1 and 3),
    status text not null check (status in ('active', 'cancelled')),
    triggered_at timestamptz not null,
    network_dispatched_at timestamptz,
    acknowledged_at timestamptz,
    acknowledged_by_id text,
    acknowledged_by_name text,
    cancelled_at timestamptz,
    created_at timestamptz not null default now()
);

-- Ein Geraet kann nur einen laufenden Alarm haben. Die Regel steht hier und nicht
-- nur im Code, damit eine Wiederholung des Funkrahmens keinen zweiten Alarm anlegt.
create unique index alarms_one_active_per_device on alarms (device_id) where status = 'active';

create index alarms_escalation_idx on alarms (triggered_at)
    where status = 'active' and level = 1 and acknowledged_at is null;

create table alarm_locations (
    id bigserial primary key,
    alarm_id uuid not null references alarms (id) on delete cascade,
    latitude double precision not null,
    longitude double precision not null,
    accuracy_meters int not null,
    source text not null check (source in ('gnss', 'cell', 'phone')),
    recorded_at timestamptz not null
);

create index alarm_locations_alarm_idx on alarm_locations (alarm_id, recorded_at desc);
-- Fuer den Loeschlauf.
create index alarm_locations_recorded_idx on alarm_locations (recorded_at);

-- Protokoll fuer Kennzahlen und Transparenzbericht. Enthaelt ausdruecklich keine
-- Koordinaten, nur Art und Zeitpunkt.
create table alarm_events (
    id bigserial primary key,
    alarm_id uuid not null references alarms (id) on delete cascade,
    type text not null,
    at timestamptz not null,
    detail jsonb not null default '{}'::jsonb
);

create index alarm_events_alarm_idx on alarm_events (alarm_id, at);

-- Gesehene Funkrahmen. Das Geraet wiederholt, bis es eine Bestaetigung bekommt;
-- ohne diese Tabelle wuerde jede verlorene Bestaetigung einen zweiten Alarm erzeugen.
create table device_uplinks (
    device_id uuid not null references devices (id) on delete cascade,
    sequence int not null,
    received_at timestamptz not null default now(),
    primary key (device_id, sequence)
);

create index device_uplinks_received_idx on device_uplinks (received_at);

-- Was beim naechsten Funkkontakt an das Geraet geht (Quittierung, Entwarnung).
create table device_downlinks (
    id bigserial primary key,
    device_id uuid not null references devices (id) on delete cascade,
    payload bytea not null,
    created_at timestamptz not null default now(),
    delivered_at timestamptz
);

create index device_downlinks_pending_idx on device_downlinks (device_id, id)
    where delivered_at is null;

-- Nachfragetest: Vormerkungen von der Landingpage.
create table waitlist_signups (
    id bigserial primary key,
    email text not null,
    segment text not null check (segment in ('kind', 'senioren', 'beruf', 'heimweg')),
    postal_code text,
    consent_at timestamptz not null default now(),
    created_at timestamptz not null default now()
);

create unique index waitlist_email_idx on waitlist_signups (lower(email));
