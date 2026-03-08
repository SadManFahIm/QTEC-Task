-- ============================================================
-- QuickHire — Database Schema
-- ============================================================
-- Run this file once to set up the database:
--   mysql -u root -p < backend/config/schema.sql
--
-- Tables:
--   jobs          — all job listings posted by admins
--   applications  — applications submitted by job seekers
-- ============================================================

-- Create the database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS quickhire;

-- Switch to the quickhire database for all subsequent statements
USE quickhire;

-- ─── Table: jobs ─────────────────────────────────────────────────────────────
-- Stores every job listing created through the admin panel.
-- The 'logo' column is optional — admins can leave it blank.
CREATE TABLE IF NOT EXISTS jobs (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  company     VARCHAR(255) NOT NULL,
  location    VARCHAR(255) NOT NULL,
  category    VARCHAR(100) NOT NULL,

  -- Only the four specified employment types are allowed
  type        ENUM('Full Time', 'Part Time', 'Remote', 'Contract') DEFAULT 'Full Time',

  description TEXT         NOT NULL,
  logo        VARCHAR(500)           NULL,  -- optional company logo URL

  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── Table: applications ─────────────────────────────────────────────────────
-- Stores every job application submitted by a candidate.
-- Linked to the jobs table via a foreign key so that deleting
-- a job automatically removes all its associated applications.
CREATE TABLE IF NOT EXISTS applications (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  job_id      INT          NOT NULL,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  resume_link VARCHAR(500) NOT NULL,  -- must be a valid URL (validated at API level)
  cover_note  TEXT                    NULL,  -- optional

  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Cascade delete: when a job is removed, its applications are removed too
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- ─── Sample Data ─────────────────────────────────────────────────────────────
-- 12 realistic job listings across multiple categories.
-- This gives the app something to display on first run.
INSERT INTO jobs (title, company, location, category, type, description, logo) VALUES

-- Marketing jobs
('Email Marketing Specialist', 'Revolut', 'Madrid, Spain', 'Marketing', 'Full Time',
 'Revolut is looking for an Email Marketing Specialist to manage and grow our email campaigns. You will work closely with the marketing team to craft engaging content, analyse campaign performance, and continuously improve open and click-through rates.', NULL),

('Email Marketing Manager', 'Pitch', 'Berlin, Germany', 'Marketing', 'Full Time',
 'Pitch is looking for an Email Marketing Manager to join our growing marketing team. You will develop and execute end-to-end email strategies, own the content calendar, and collaborate cross-functionally with design and product teams.', NULL),

('Social Media Assistant', 'Nomad', 'Paris, France', 'Marketing', 'Full Time',
 'Great opportunity for a social media enthusiast to join our team. You will manage our social channels, create engaging content, monitor trends, and report on performance metrics to help grow our online community.', NULL),

('Social Media Assistant', 'Netlify', 'Paris, France', 'Marketing', 'Full Time',
 'Join the Netlify marketing team as a Social Media Assistant. You will help grow our developer community by creating authentic content, engaging with followers, and tracking the success of our social campaigns.', NULL),

-- Design jobs
('Brand Designer', 'Dropbox', 'San Francisco, US', 'Design', 'Full Time',
 'Dropbox is looking for a Brand Designer to help define and execute our visual identity across all customer touchpoints. You will collaborate with product and marketing teams to create cohesive, on-brand design systems. A strong portfolio is required.', NULL),

('Visual Designer', 'Blinklist', 'Granada, Spain', 'Design', 'Full Time',
 'Blinklist is looking for a Visual Designer to ensure visual communication consistency across all products. You will create high-quality graphics, illustrations, and UI assets that align with our brand guidelines.', NULL),

('Product Designer', 'ClassPass', 'Manchester, UK', 'Design', 'Full Time',
 'ClassPass is looking for a Product Designer to design and improve our core user experience. You will partner closely with engineers and product managers to translate complex problems into intuitive, delightful interfaces.', NULL),

-- Engineering jobs
('Lead Engineer', 'Canva', 'Ontario, Canada', 'Engineering', 'Full Time',
 'Canva is looking for a Lead Engineer to guide a high-performing engineering team. You will drive architectural decisions, mentor junior engineers, lead code reviews, and ensure we ship reliable, scalable features on time.', NULL),

('Interactive Developer', 'Terraform', 'Hamburg, Germany', 'Technology', 'Full Time',
 'Terraform is looking for a creative Interactive Developer to build engaging digital experiences. You will prototype and implement interactive web experiences, experiments, and data visualisations using modern front-end technologies.', NULL),

-- Business jobs
('Brand Strategist', 'GoDaddy', 'Marseille, France', 'Business', 'Full Time',
 'GoDaddy is looking for a Brand Strategist to define and evolve our brand positioning across all markets. You will conduct market research, develop messaging frameworks, and work with creative teams to bring the strategy to life.', NULL),

-- Technology jobs
('Data Analyst', 'Twitter', 'San Diego, US', 'Technology', 'Full Time',
 'Twitter is looking for a Data Analyst to help the team turn large datasets into actionable insights. You will build dashboards, analyse user behaviour, and present findings to stakeholders to support data-driven decision making.', NULL),

-- Human Resource jobs
('HR Manager', 'Packer', 'Lucerne, Switzerland', 'Human Resource', 'Full Time',
 'Packer is looking for an experienced HR Manager to oversee all human resources operations. You will manage the full employee lifecycle — from recruitment and onboarding through to performance management and offboarding.', NULL);
