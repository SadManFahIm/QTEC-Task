-- =============================================================
--  QuickHire — Database Schema
--  File: backend/config/schema.sql
--
--  Run this once to set up the database from scratch:
--    mysql -u root -p < backend/config/schema.sql
--
--  Or from inside the MySQL shell:
--    source /full/path/to/backend/config/schema.sql
--
--  This script is safe to re-run — it uses IF NOT EXISTS guards
--  so it won't crash if the database or tables already exist.
-- =============================================================


-- ── 1. DATABASE ───────────────────────────────────────────────
CREATE DATABASE IF NOT EXISTS quickhire
  CHARACTER SET utf8mb4       -- supports all Unicode characters (emojis, etc.)
  COLLATE utf8mb4_unicode_ci; -- case-insensitive, accent-aware sorting

USE quickhire;


-- ── 2. JOBS TABLE ─────────────────────────────────────────────
-- Stores every job listing posted by admins.
CREATE TABLE IF NOT EXISTS jobs (
  id          INT           AUTO_INCREMENT PRIMARY KEY,  -- unique identifier
  title       VARCHAR(255)  NOT NULL,                    -- e.g. "Senior Designer"
  company     VARCHAR(255)  NOT NULL,                    -- e.g. "Dropbox"
  location    VARCHAR(255)  NOT NULL,                    -- e.g. "San Francisco, US"
  category    VARCHAR(100)  NOT NULL,                    -- e.g. "Design"
  type        ENUM(
                'Full Time',
                'Part Time',
                'Remote',
                'Contract'
              )             NOT NULL DEFAULT 'Full Time',
  description TEXT          NOT NULL,                    -- full job description
  logo        VARCHAR(500)  NULL,                        -- optional company logo URL
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- ── 3. APPLICATIONS TABLE ─────────────────────────────────────
-- Stores every job application submitted by candidates.
CREATE TABLE IF NOT EXISTS applications (
  id          INT           AUTO_INCREMENT PRIMARY KEY,
  job_id      INT           NOT NULL,                   -- references the job being applied to
  name        VARCHAR(255)  NOT NULL,                   -- applicant full name
  email       VARCHAR(255)  NOT NULL,                   -- applicant email
  resume_link VARCHAR(500)  NOT NULL,                   -- URL to resume (Google Drive, etc.)
  cover_note  TEXT          NULL,                       -- optional personal message
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- If a job is deleted, all its applications are automatically deleted too.
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,

  -- Prevents the same email from applying to the same job twice.
  UNIQUE KEY unique_application (job_id, email)
);


-- ── 4. SAMPLE DATA ────────────────────────────────────────────
-- 12 realistic job listings so the app looks populated on first run.
-- The INSERT IGNORE prevents duplicates if you re-run this file.
INSERT IGNORE INTO jobs (title, company, location, category, type, description) VALUES
(
  'Email Marketing Specialist',
  'Revolut',
  'Madrid, Spain',
  'Marketing',
  'Full Time',
  'Revolut is looking for an Email Marketing Specialist to help manage and grow our email marketing campaigns. You will work closely with the marketing team to create engaging content, analyse performance metrics, and continuously improve open and click-through rates.'
),
(
  'Brand Designer',
  'Dropbox',
  'San Francisco, US',
  'Design',
  'Full Time',
  'Dropbox is looking for a Brand Designer to define and execute our visual identity across all touchpoints — from product UI to marketing materials. A strong portfolio demonstrating brand systems work is required.'
),
(
  'Email Marketing Manager',
  'Pitch',
  'Berlin, Germany',
  'Marketing',
  'Full Time',
  'Pitch is looking for an experienced Email Marketing Manager to own the full email channel. You will develop strategies, write copy, set up automation flows, and report on campaign performance to senior stakeholders.'
),
(
  'Visual Designer',
  'Blinklist',
  'Granada, Spain',
  'Design',
  'Full Time',
  'Blinklist is looking for a Visual Designer to maintain brand consistency across all digital and print materials. You will collaborate with product and marketing teams to deliver high-quality visuals on tight timelines.'
),
(
  'Product Designer',
  'ClassPass',
  'Manchester, UK',
  'Design',
  'Full Time',
  'ClassPass is looking for a Product Designer to shape the end-to-end experience of our consumer app. You will run user research sessions, create wireframes and prototypes, and work directly with engineering to ship polished features.'
),
(
  'Lead Engineer',
  'Canva',
  'Ontario, Canada',
  'Engineering',
  'Full Time',
  'Canva is looking for a Lead Engineer to head a cross-functional squad responsible for our real-time collaboration infrastructure. You will drive architectural decisions, mentor junior engineers, and ensure the team ships reliably at scale.'
),
(
  'Brand Strategist',
  'GoDaddy',
  'Marseille, France',
  'Business',
  'Full Time',
  'GoDaddy is looking for a Brand Strategist to define and evolve our brand positioning in the European market. You will conduct competitive analysis, lead workshops with stakeholders, and translate strategy into actionable creative briefs.'
),
(
  'Data Analyst',
  'Twitter',
  'San Diego, US',
  'Technology',
  'Full Time',
  'Twitter is looking for a Data Analyst to surface insights from large-scale behavioural datasets. You will build dashboards, write complex SQL queries, and present findings to product and growth teams to inform roadmap decisions.'
),
(
  'Social Media Assistant',
  'Nomad',
  'Paris, France',
  'Marketing',
  'Full Time',
  'Nomad is looking for a creative Social Media Assistant to manage day-to-day content scheduling, community engagement, and performance reporting across Instagram, Twitter, and LinkedIn.'
),
(
  'Social Media Assistant',
  'Netlify',
  'Paris, France',
  'Marketing',
  'Full Time',
  'Netlify is looking for a Social Media Assistant to join our growing developer marketing team. You will craft developer-focused content, monitor trends, and help grow our community of 3 million+ developers.'
),
(
  'HR Manager',
  'Packer',
  'Lucerne, Switzerland',
  'Human Resource',
  'Full Time',
  'Packer is looking for an experienced HR Manager to oversee the full employee lifecycle — from recruitment and onboarding to performance reviews and offboarding — for our team of 120 across three countries.'
),
(
  'Interactive Developer',
  'Terraform',
  'Hamburg, Germany',
  'Technology',
  'Full Time',
  'Terraform is looking for an Interactive Developer to build rich, animation-heavy marketing experiences using WebGL, Three.js, and GSAP. You will collaborate with designers to bring bold creative concepts to life in the browser.'
);
