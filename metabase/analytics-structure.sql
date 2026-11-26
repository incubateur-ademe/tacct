--
-- PostgreSQL database dump
--

-- Dumped from database version 18.6 (Debian 18.6-1.pgdg12+2)
-- Dumped by pg_dump version 18.0

-- Started on 2026-11-26 14:55:35

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 7 (class 2615 OID 16401)
-- Name: analytics; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA analytics;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 256 (class 1259 OID 973110)
-- Name: all_autocapture_raw; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.all_autocapture_raw (
    id bigint NOT NULL,
    event_timestamp timestamp with time zone NOT NULL,
    properties jsonb,
    distinct_id text,
    session_id text,
    current_url text,
    person_id text,
    ingested_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 255 (class 1259 OID 973109)
-- Name: all_autocapture_raw_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.all_autocapture_raw_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4712 (class 0 OID 0)
-- Dependencies: 255
-- Name: all_autocapture_raw_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.all_autocapture_raw_id_seq OWNED BY analytics.all_autocapture_raw.id;


--
-- TOC entry 246 (class 1259 OID 797731)
-- Name: all_pageview_raw; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.all_pageview_raw (
    id bigint NOT NULL,
    event_timestamp timestamp with time zone NOT NULL,
    properties jsonb,
    distinct_id text,
    session_id text,
    current_url text,
    person_id text,
    ingested_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 245 (class 1259 OID 797730)
-- Name: all_pageview_raw_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.all_pageview_raw_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4713 (class 0 OID 0)
-- Dependencies: 245
-- Name: all_pageview_raw_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.all_pageview_raw_id_seq OWNED BY analytics.all_pageview_raw.id;


--
-- TOC entry 258 (class 1259 OID 1023369)
-- Name: baserow_evenements; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.baserow_evenements (
    id bigint NOT NULL,
    ordre text,
    nom text,
    date text,
    type jsonb,
    qui_anime_evenement text[],
    compte_rendu text,
    nom_participants text[],
    nom_territoires text[],
    propos_nom_evenement text[],
    campagne_test_utilisateur jsonb,
    champs_rapporte text[],
    fichier text[],
    ingested_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 257 (class 1259 OID 1023368)
-- Name: baserow_evenements_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.baserow_evenements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4714 (class 0 OID 0)
-- Dependencies: 257
-- Name: baserow_evenements_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.baserow_evenements_id_seq OWNED BY analytics.baserow_evenements.id;


--
-- TOC entry 260 (class 1259 OID 1023477)
-- Name: baserow_territoires; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.baserow_territoires (
    id bigint NOT NULL,
    ordre text,
    nom_territoire text,
    notes_ouvertes text,
    typologie_territoire text[],
    thematique_prioritaire text[],
    be boolean,
    soumis_a_pcaet boolean,
    demarches_et_programmes text[],
    documents_de_planification text[],
    avancee_sur_le_ddv text[],
    avancee_sur_la_strategie text[],
    suivi_evaluation boolean,
    date_validation text,
    date_revision_estimee text,
    propos text[],
    attente_session_accueil text[],
    role_be text[],
    cdm text[],
    siren text,
    ingested_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 259 (class 1259 OID 1023476)
-- Name: baserow_territoires_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.baserow_territoires_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4715 (class 0 OID 0)
-- Dependencies: 259
-- Name: baserow_territoires_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.baserow_territoires_id_seq OWNED BY analytics.baserow_territoires.id;


--
-- TOC entry 283 (class 1259 OID 3867043)
-- Name: boutons_etape2; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.boutons_etape2 (
    event text NOT NULL,
    event_timestamp timestamp with time zone NOT NULL,
    properties jsonb,
    distinct_id text,
    session_id text,
    person_id text
);


--
-- TOC entry 248 (class 1259 OID 868844)
-- Name: boutons_export_raw; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.boutons_export_raw (
    id bigint NOT NULL,
    event text NOT NULL,
    event_timestamp timestamp with time zone NOT NULL,
    session_id text,
    person_id text,
    code_geographique text,
    libelle_geographique text,
    thematique text,
    ingested_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 247 (class 1259 OID 868843)
-- Name: boutons_export_raw_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.boutons_export_raw_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4716 (class 0 OID 0)
-- Dependencies: 247
-- Name: boutons_export_raw_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.boutons_export_raw_id_seq OWNED BY analytics.boutons_export_raw.id;


--
-- TOC entry 252 (class 1259 OID 971874)
-- Name: boutons_homepage; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.boutons_homepage (
    id bigint NOT NULL,
    event text,
    event_timestamp timestamp with time zone NOT NULL,
    properties jsonb,
    distinct_id text,
    session_id text,
    person_id text,
    ingested_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 251 (class 1259 OID 971873)
-- Name: boutons_homepage_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.boutons_homepage_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4717 (class 0 OID 0)
-- Dependencies: 251
-- Name: boutons_homepage_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.boutons_homepage_id_seq OWNED BY analytics.boutons_homepage.id;


--
-- TOC entry 262 (class 1259 OID 1024149)
-- Name: couverture_population; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.couverture_population (
    id bigint NOT NULL,
    date timestamp with time zone DEFAULT now() NOT NULL,
    population integer NOT NULL
);


--
-- TOC entry 261 (class 1259 OID 1024148)
-- Name: couverture_population_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.couverture_population_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4718 (class 0 OID 0)
-- Dependencies: 261
-- Name: couverture_population_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.couverture_population_id_seq OWNED BY analytics.couverture_population.id;


--
-- TOC entry 241 (class 1259 OID 452084)
-- Name: north_star_metric; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.north_star_metric (
    value character varying(32) NOT NULL,
    date timestamp without time zone NOT NULL,
    pk integer NOT NULL
);


--
-- TOC entry 242 (class 1259 OID 452089)
-- Name: north_star_metric_pk_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.north_star_metric_pk_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 185498498
    CACHE 1;


--
-- TOC entry 4719 (class 0 OID 0)
-- Dependencies: 242
-- Name: north_star_metric_pk_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.north_star_metric_pk_seq OWNED BY analytics.north_star_metric.pk;


--
-- TOC entry 254 (class 1259 OID 972373)
-- Name: ressources_consultees; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.ressources_consultees (
    id bigint NOT NULL,
    event_timestamp timestamp with time zone NOT NULL,
    distinct_id text,
    session_id text,
    person_id text,
    ressource text,
    ingested_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 253 (class 1259 OID 972372)
-- Name: ressources_consultees_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.ressources_consultees_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4720 (class 0 OID 0)
-- Dependencies: 253
-- Name: ressources_consultees_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.ressources_consultees_id_seq OWNED BY analytics.ressources_consultees.id;


--
-- TOC entry 344 (class 1259 OID 4130180)
-- Name: tacctoscope_ressources; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.tacctoscope_ressources (
    id bigint NOT NULL,
    event_timestamp timestamp with time zone NOT NULL,
    session_id text,
    person_id text,
    ressource_url text,
    ressource_titre text,
    ressource_tag text,
    ingested_at timestamp with time zone DEFAULT now() NOT NULL,
    event text NOT NULL
);


--
-- TOC entry 343 (class 1259 OID 4130179)
-- Name: tacctoscope_ressources_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.tacctoscope_ressources_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4721 (class 0 OID 0)
-- Dependencies: 343
-- Name: tacctoscope_ressources_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.tacctoscope_ressources_id_seq OWNED BY analytics.tacctoscope_ressources.id;


--
-- TOC entry 250 (class 1259 OID 971832)
-- Name: thematique; Type: TABLE; Schema: analytics; Owner: -
--

CREATE TABLE analytics.thematique (
    id bigint NOT NULL,
    event_timestamp timestamp with time zone NOT NULL,
    properties jsonb,
    distinct_id text,
    session_id text,
    person_id text,
    thematique text,
    ingested_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 249 (class 1259 OID 971831)
-- Name: thematique_id_seq; Type: SEQUENCE; Schema: analytics; Owner: -
--

CREATE SEQUENCE analytics.thematique_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4722 (class 0 OID 0)
-- Dependencies: 249
-- Name: thematique_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: -
--

ALTER SEQUENCE analytics.thematique_id_seq OWNED BY analytics.thematique.id;


--
-- TOC entry 4498 (class 2604 OID 18086)
-- Name: all_autocapture_raw id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.all_autocapture_raw ALTER COLUMN id SET DEFAULT nextval('analytics.all_autocapture_raw_id_seq'::regclass);


--
-- TOC entry 4488 (class 2604 OID 18087)
-- Name: all_pageview_raw id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.all_pageview_raw ALTER COLUMN id SET DEFAULT nextval('analytics.all_pageview_raw_id_seq'::regclass);


--
-- TOC entry 4500 (class 2604 OID 18088)
-- Name: baserow_evenements id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.baserow_evenements ALTER COLUMN id SET DEFAULT nextval('analytics.baserow_evenements_id_seq'::regclass);


--
-- TOC entry 4502 (class 2604 OID 18089)
-- Name: baserow_territoires id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.baserow_territoires ALTER COLUMN id SET DEFAULT nextval('analytics.baserow_territoires_id_seq'::regclass);


--
-- TOC entry 4490 (class 2604 OID 18090)
-- Name: boutons_export_raw id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.boutons_export_raw ALTER COLUMN id SET DEFAULT nextval('analytics.boutons_export_raw_id_seq'::regclass);


--
-- TOC entry 4494 (class 2604 OID 18091)
-- Name: boutons_homepage id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.boutons_homepage ALTER COLUMN id SET DEFAULT nextval('analytics.boutons_homepage_id_seq'::regclass);


--
-- TOC entry 4504 (class 2604 OID 18092)
-- Name: couverture_population id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.couverture_population ALTER COLUMN id SET DEFAULT nextval('analytics.couverture_population_id_seq'::regclass);


--
-- TOC entry 4496 (class 2604 OID 18093)
-- Name: ressources_consultees id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.ressources_consultees ALTER COLUMN id SET DEFAULT nextval('analytics.ressources_consultees_id_seq'::regclass);


--
-- TOC entry 4506 (class 2604 OID 18094)
-- Name: tacctoscope_ressources id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.tacctoscope_ressources ALTER COLUMN id SET DEFAULT nextval('analytics.tacctoscope_ressources_id_seq'::regclass);


--
-- TOC entry 4492 (class 2604 OID 18095)
-- Name: thematique id; Type: DEFAULT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.thematique ALTER COLUMN id SET DEFAULT nextval('analytics.thematique_id_seq'::regclass);


--
-- TOC entry 4531 (class 2606 OID 18329)
-- Name: all_autocapture_raw all_autocapture_raw_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.all_autocapture_raw
    ADD CONSTRAINT all_autocapture_raw_pkey PRIMARY KEY (id);


--
-- TOC entry 4511 (class 2606 OID 18330)
-- Name: all_pageview_raw all_pageview_raw_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.all_pageview_raw
    ADD CONSTRAINT all_pageview_raw_pkey PRIMARY KEY (id);


--
-- TOC entry 4535 (class 2606 OID 18331)
-- Name: baserow_evenements baserow_evenements_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.baserow_evenements
    ADD CONSTRAINT baserow_evenements_pkey PRIMARY KEY (id);


--
-- TOC entry 4539 (class 2606 OID 18332)
-- Name: baserow_territoires baserow_territoires_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.baserow_territoires
    ADD CONSTRAINT baserow_territoires_pkey PRIMARY KEY (id);


--
-- TOC entry 4515 (class 2606 OID 18333)
-- Name: boutons_export_raw boutons_export_raw_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.boutons_export_raw
    ADD CONSTRAINT boutons_export_raw_pkey PRIMARY KEY (id);


--
-- TOC entry 4523 (class 2606 OID 18334)
-- Name: boutons_homepage boutons_homepage_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.boutons_homepage
    ADD CONSTRAINT boutons_homepage_pkey PRIMARY KEY (id);


--
-- TOC entry 4543 (class 2606 OID 18335)
-- Name: couverture_population couverture_population_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.couverture_population
    ADD CONSTRAINT couverture_population_pkey PRIMARY KEY (id);


--
-- TOC entry 4509 (class 2606 OID 18336)
-- Name: north_star_metric north_star_metric_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.north_star_metric
    ADD CONSTRAINT north_star_metric_pkey PRIMARY KEY (pk);


--
-- TOC entry 4527 (class 2606 OID 18337)
-- Name: ressources_consultees ressources_consultees_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.ressources_consultees
    ADD CONSTRAINT ressources_consultees_pkey PRIMARY KEY (id);


--
-- TOC entry 4549 (class 2606 OID 18338)
-- Name: tacctoscope_ressources tacctoscope_ressources_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.tacctoscope_ressources
    ADD CONSTRAINT tacctoscope_ressources_pkey PRIMARY KEY (id);


--
-- TOC entry 4519 (class 2606 OID 18339)
-- Name: thematique thematique_pkey; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.thematique
    ADD CONSTRAINT thematique_pkey PRIMARY KEY (id);


--
-- TOC entry 4537 (class 2606 OID 18340)
-- Name: baserow_evenements unique_ordre_evenements; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.baserow_evenements
    ADD CONSTRAINT unique_ordre_evenements UNIQUE (ordre);


--
-- TOC entry 4541 (class 2606 OID 18341)
-- Name: baserow_territoires unique_ordre_territoires; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.baserow_territoires
    ADD CONSTRAINT unique_ordre_territoires UNIQUE (ordre);


--
-- TOC entry 4533 (class 2606 OID 18342)
-- Name: all_autocapture_raw uq_all_autocapture_raw_natural; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.all_autocapture_raw
    ADD CONSTRAINT uq_all_autocapture_raw_natural UNIQUE (event_timestamp, distinct_id, session_id, current_url, person_id);


--
-- TOC entry 4513 (class 2606 OID 18343)
-- Name: all_pageview_raw uq_all_pageview_raw_natural; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.all_pageview_raw
    ADD CONSTRAINT uq_all_pageview_raw_natural UNIQUE (event_timestamp, distinct_id, session_id, current_url, person_id);


--
-- TOC entry 4547 (class 2606 OID 18344)
-- Name: boutons_etape2 uq_boutons_etape2_natural; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.boutons_etape2
    ADD CONSTRAINT uq_boutons_etape2_natural UNIQUE (event, event_timestamp, session_id, person_id);


--
-- TOC entry 4517 (class 2606 OID 18345)
-- Name: boutons_export_raw uq_boutons_export_raw_natural; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.boutons_export_raw
    ADD CONSTRAINT uq_boutons_export_raw_natural UNIQUE (event, event_timestamp, session_id, person_id, code_geographique, libelle_geographique, thematique);


--
-- TOC entry 4525 (class 2606 OID 18346)
-- Name: boutons_homepage uq_boutons_homepage_natural; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.boutons_homepage
    ADD CONSTRAINT uq_boutons_homepage_natural UNIQUE (event_timestamp, distinct_id, session_id, person_id);


--
-- TOC entry 4529 (class 2606 OID 18347)
-- Name: ressources_consultees uq_ressources_consultees_natural; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.ressources_consultees
    ADD CONSTRAINT uq_ressources_consultees_natural UNIQUE (event_timestamp, distinct_id, session_id, person_id);


--
-- TOC entry 4551 (class 2606 OID 4228478)
-- Name: tacctoscope_ressources uq_tacctoscope_ressources_natural; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.tacctoscope_ressources
    ADD CONSTRAINT uq_tacctoscope_ressources_natural UNIQUE (event, event_timestamp, session_id, person_id, ressource_url);


--
-- TOC entry 4521 (class 2606 OID 18349)
-- Name: thematique uq_thematique_natural; Type: CONSTRAINT; Schema: analytics; Owner: -
--

ALTER TABLE ONLY analytics.thematique
    ADD CONSTRAINT uq_thematique_natural UNIQUE (event_timestamp, distinct_id, session_id, person_id);


--
-- TOC entry 4544 (class 1259 OID 3867051)
-- Name: idx_boutons_etape2_session; Type: INDEX; Schema: analytics; Owner: -
--

CREATE INDEX idx_boutons_etape2_session ON analytics.boutons_etape2 USING btree (session_id);


--
-- TOC entry 4545 (class 1259 OID 3867050)
-- Name: idx_boutons_etape2_timestamp; Type: INDEX; Schema: analytics; Owner: -
--

CREATE INDEX idx_boutons_etape2_timestamp ON analytics.boutons_etape2 USING btree (event_timestamp);


-- Completed on 2026-11-26 14:55:36

--
-- PostgreSQL database dump complete
--

