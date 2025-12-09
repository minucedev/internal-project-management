--
-- PostgreSQL database dump
--

\restrict 4QgDwAx23dLxPoXjujvn3UwK21NKjgDHGunPLhKhge0DJGAoGK0hEsLrsGzWiOE

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-12-10 00:04:25

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
-- TOC entry 860 (class 1247 OID 17357)
-- Name: project_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.project_role AS ENUM (
    'leader',
    'member',
    'viewer'
);


ALTER TYPE public.project_role OWNER TO postgres;

--
-- TOC entry 863 (class 1247 OID 17364)
-- Name: project_user_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.project_user_status AS ENUM (
    'active',
    'inactive',
    'pending',
    'removed'
);


ALTER TYPE public.project_user_status OWNER TO postgres;

--
-- TOC entry 869 (class 1247 OID 17384)
-- Name: task_priority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.task_priority AS ENUM (
    'Low',
    'Medium',
    'High',
    'Critical'
);


ALTER TYPE public.task_priority OWNER TO postgres;

--
-- TOC entry 866 (class 1247 OID 17374)
-- Name: task_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.task_status AS ENUM (
    'To Do',
    'In Progress',
    'Blocked',
    'Done'
);


ALTER TYPE public.task_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 225 (class 1259 OID 17447)
-- Name: project_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_users (
    project_id integer NOT NULL,
    user_id integer NOT NULL,
    role_in_project public.project_role DEFAULT 'member'::public.project_role NOT NULL,
    position_title character varying(100),
    status_in_project public.project_user_status DEFAULT 'active'::public.project_user_status NOT NULL,
    joined_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.project_users OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 17431)
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    created_by integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17430)
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO postgres;

--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 223
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- TOC entry 220 (class 1259 OID 17394)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17393)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 219
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 227 (class 1259 OID 17470)
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    status public.task_status DEFAULT 'To Do'::public.task_status NOT NULL,
    priority public.task_priority DEFAULT 'Medium'::public.task_priority NOT NULL,
    deadline timestamp with time zone,
    completed_at timestamp with time zone,
    assignee_id integer,
    created_by integer,
    project_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 17469)
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tasks_id_seq OWNER TO postgres;

--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 226
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- TOC entry 222 (class 1259 OID 17407)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17406)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4890 (class 2604 OID 17434)
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- TOC entry 4887 (class 2604 OID 17397)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 4895 (class 2604 OID 17473)
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- TOC entry 4888 (class 2604 OID 17410)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5080 (class 0 OID 17447)
-- Dependencies: 225
-- Data for Name: project_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_users (project_id, user_id, role_in_project, position_title, status_in_project, joined_at) FROM stdin;
\.


--
-- TOC entry 5079 (class 0 OID 17431)
-- Dependencies: 224
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, name, description, start_date, end_date, created_by, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5075 (class 0 OID 17394)
-- Dependencies: 220
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, description) FROM stdin;
1	USER	Default user role.
2	ADMIN	System maintenance role.
\.


--
-- TOC entry 5082 (class 0 OID 17470)
-- Dependencies: 227
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, title, description, status, priority, deadline, completed_at, assignee_id, created_by, project_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5077 (class 0 OID 17407)
-- Dependencies: 222
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, role_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 223
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 1, false);


--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 219
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 2, true);


--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 226
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tasks_id_seq', 1, false);


--
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- TOC entry 4914 (class 2606 OID 17458)
-- Name: project_users project_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_users
    ADD CONSTRAINT project_users_pkey PRIMARY KEY (project_id, user_id);


--
-- TOC entry 4912 (class 2606 OID 17441)
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- TOC entry 4900 (class 2606 OID 17405)
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- TOC entry 4902 (class 2606 OID 17403)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4919 (class 2606 OID 17485)
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- TOC entry 4905 (class 2606 OID 17424)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4907 (class 2606 OID 17420)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4909 (class 2606 OID 17422)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4910 (class 1259 OID 17502)
-- Name: idx_projects_created_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_projects_created_by ON public.projects USING btree (created_by);


--
-- TOC entry 4915 (class 1259 OID 17505)
-- Name: idx_tasks_assignee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tasks_assignee ON public.tasks USING btree (assignee_id);


--
-- TOC entry 4916 (class 1259 OID 17503)
-- Name: idx_tasks_project_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tasks_project_id ON public.tasks USING btree (project_id);


--
-- TOC entry 4917 (class 1259 OID 17504)
-- Name: idx_tasks_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tasks_status ON public.tasks USING btree (status);


--
-- TOC entry 4903 (class 1259 OID 17501)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 4924 (class 2606 OID 17496)
-- Name: tasks fk_assignee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT fk_assignee FOREIGN KEY (assignee_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 4921 (class 2606 OID 17442)
-- Name: projects fk_created_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 4925 (class 2606 OID 17491)
-- Name: tasks fk_created_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 4922 (class 2606 OID 17459)
-- Name: project_users fk_project; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_users
    ADD CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4926 (class 2606 OID 17486)
-- Name: tasks fk_project; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4920 (class 2606 OID 17425)
-- Name: users fk_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- TOC entry 4923 (class 2606 OID 17464)
-- Name: project_users fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_users
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-12-10 00:04:26

--
-- PostgreSQL database dump complete
--

\unrestrict 4QgDwAx23dLxPoXjujvn3UwK21NKjgDHGunPLhKhge0DJGAoGK0hEsLrsGzWiOE

