CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: check_booking_availability(uuid, date, date, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_booking_availability(p_accommodation_id uuid, p_check_in date, p_check_out date, p_exclude_booking_id uuid DEFAULT NULL::uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.bookings
    WHERE accommodation_id = p_accommodation_id
    AND status != 'cancelled'
    AND id != COALESCE(p_exclude_booking_id, '00000000-0000-0000-0000-000000000000'::uuid)
    AND (
      (check_in <= p_check_in AND check_out > p_check_in)
      OR (check_in < p_check_out AND check_out >= p_check_out)
      OR (check_in >= p_check_in AND check_out <= p_check_out)
    )
  );
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: accommodations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accommodations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    number_of_units integer NOT NULL,
    street_address text NOT NULL,
    barangay text NOT NULL,
    municipality_city text NOT NULL,
    province text NOT NULL,
    zip_code text NOT NULL,
    region text NOT NULL,
    amenities jsonb DEFAULT '[]'::jsonb,
    website text,
    facebook_page text,
    instagram text,
    google_maps_link text,
    description text,
    contact_name text NOT NULL,
    contact_email text NOT NULL,
    contact_number text NOT NULL,
    consent_given boolean DEFAULT false,
    status text DEFAULT 'pending'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    wifi_providers jsonb DEFAULT '[]'::jsonb,
    wifi_download_speed numeric,
    wifi_upload_speed numeric,
    wifi_ping numeric,
    wifi_jitter numeric,
    imported_from_airbnb boolean DEFAULT false,
    resort_title text,
    sec_download_url text,
    gis_document_url text,
    permit_document_url text,
    destination text,
    latitude numeric,
    longitude numeric,
    cleaning_fee numeric DEFAULT 0,
    featured boolean DEFAULT false
);


--
-- Name: bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    accommodation_id uuid NOT NULL,
    unit_type_id uuid,
    check_in date NOT NULL,
    check_out date NOT NULL,
    guest_count integer DEFAULT 1 NOT NULL,
    guest_name text NOT NULL,
    guest_email text NOT NULL,
    guest_phone text,
    total_price numeric NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT valid_dates CHECK ((check_out > check_in)),
    CONSTRAINT valid_guest_count CHECK ((guest_count > 0))
);


--
-- Name: experiences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.experiences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    destination text NOT NULL,
    price numeric NOT NULL,
    images jsonb DEFAULT '[]'::jsonb,
    description text,
    duration text,
    included jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: extra_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.extra_links (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    accommodation_id uuid NOT NULL,
    url text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    accommodation_id uuid NOT NULL,
    image_url text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    accommodation_id uuid NOT NULL,
    guest_name text NOT NULL,
    guest_email text,
    rating integer NOT NULL,
    review_text text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: unit_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.unit_types (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    accommodation_id uuid NOT NULL,
    unit_name text NOT NULL,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    source_url text,
    guests integer,
    bedrooms integer,
    bathrooms integer
);


--
-- Name: accommodations accommodations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accommodations
    ADD CONSTRAINT accommodations_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: experiences experiences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT experiences_pkey PRIMARY KEY (id);


--
-- Name: extra_links extra_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.extra_links
    ADD CONSTRAINT extra_links_pkey PRIMARY KEY (id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: unit_types unit_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unit_types
    ADD CONSTRAINT unit_types_pkey PRIMARY KEY (id);


--
-- Name: accommodations update_accommodations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_accommodations_updated_at BEFORE UPDATE ON public.accommodations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: bookings update_bookings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: bookings bookings_accommodation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_accommodation_id_fkey FOREIGN KEY (accommodation_id) REFERENCES public.accommodations(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_unit_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_unit_type_id_fkey FOREIGN KEY (unit_type_id) REFERENCES public.unit_types(id) ON DELETE SET NULL;


--
-- Name: extra_links extra_links_accommodation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.extra_links
    ADD CONSTRAINT extra_links_accommodation_id_fkey FOREIGN KEY (accommodation_id) REFERENCES public.accommodations(id) ON DELETE CASCADE;


--
-- Name: images images_accommodation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_accommodation_id_fkey FOREIGN KEY (accommodation_id) REFERENCES public.accommodations(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_accommodation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_accommodation_id_fkey FOREIGN KEY (accommodation_id) REFERENCES public.accommodations(id) ON DELETE CASCADE;


--
-- Name: unit_types unit_types_accommodation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unit_types
    ADD CONSTRAINT unit_types_accommodation_id_fkey FOREIGN KEY (accommodation_id) REFERENCES public.accommodations(id) ON DELETE CASCADE;


--
-- Name: bookings Anyone can create bookings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);


--
-- Name: reviews Anyone can create reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create reviews" ON public.reviews FOR INSERT WITH CHECK (true);


--
-- Name: accommodations Anyone can delete accommodations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete accommodations" ON public.accommodations FOR DELETE USING (true);


--
-- Name: extra_links Anyone can delete extra links; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete extra links" ON public.extra_links FOR DELETE USING (true);


--
-- Name: images Anyone can delete images; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete images" ON public.images FOR DELETE USING (true);


--
-- Name: unit_types Anyone can delete unit types; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete unit types" ON public.unit_types FOR DELETE USING (true);


--
-- Name: extra_links Anyone can insert extra links; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert extra links" ON public.extra_links FOR INSERT WITH CHECK (true);


--
-- Name: images Anyone can insert images; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert images" ON public.images FOR INSERT WITH CHECK (true);


--
-- Name: unit_types Anyone can insert unit types; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert unit types" ON public.unit_types FOR INSERT WITH CHECK (true);


--
-- Name: experiences Anyone can manage experiences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can manage experiences" ON public.experiences USING (true);


--
-- Name: accommodations Anyone can submit accommodation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit accommodation" ON public.accommodations FOR INSERT WITH CHECK (true);


--
-- Name: accommodations Anyone can update accommodations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update accommodations" ON public.accommodations FOR UPDATE USING (true);


--
-- Name: bookings Anyone can update bookings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update bookings" ON public.bookings FOR UPDATE USING (true);


--
-- Name: extra_links Anyone can update extra links; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update extra links" ON public.extra_links FOR UPDATE USING (true);


--
-- Name: images Anyone can update images; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update images" ON public.images FOR UPDATE USING (true);


--
-- Name: unit_types Anyone can update unit types; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update unit types" ON public.unit_types FOR UPDATE USING (true);


--
-- Name: accommodations Anyone can view accommodations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view accommodations" ON public.accommodations FOR SELECT USING (true);


--
-- Name: bookings Anyone can view bookings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view bookings" ON public.bookings FOR SELECT USING (true);


--
-- Name: experiences Anyone can view experiences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view experiences" ON public.experiences FOR SELECT USING (true);


--
-- Name: extra_links Anyone can view extra links; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view extra links" ON public.extra_links FOR SELECT USING (true);


--
-- Name: images Anyone can view images; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view images" ON public.images FOR SELECT USING (true);


--
-- Name: reviews Anyone can view reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);


--
-- Name: unit_types Anyone can view unit types; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view unit types" ON public.unit_types FOR SELECT USING (true);


--
-- Name: accommodations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;

--
-- Name: bookings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

--
-- Name: experiences; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

--
-- Name: extra_links; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.extra_links ENABLE ROW LEVEL SECURITY;

--
-- Name: images; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

--
-- Name: reviews; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

--
-- Name: unit_types; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.unit_types ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


