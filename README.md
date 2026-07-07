# ResourceFile - Team Toolkit

A web app that turns paper community resource flyers into a searchable, shared digital library. Built for a social services case management team.

**Live app:** [rezourcescanner.netlify.app](https://rezourcescanner.netlify.app)

## Problem

Case managers collect physical flyers for housing, food, mental health, and other community resources, but flyers get lost, go out of date, and aren't searchable. There was no shared way for staff to know what resources existed or whether they were still current.

## Solution

Staff scan a flyer with their phone camera. AI reads the flyer and pulls out the resource name, category, contact info, hours, eligibility requirements, and services offered, then saves it to a shared library the whole team can search and browse.

## Screenshots

**Scan a flyer**

Staff take a photo or upload an image. AI handles the data entry.

<img src="screenshots/scan-flyer.png" alt="Scan a resource flyer" width="280">

**Resource library**

Every saved resource is sorted into categories and searchable by the whole team.

<img src="screenshots/resource-library.png" alt="Resource library view" width="280">

**Resource detail**

Each entry includes the original flyer image alongside an AI-generated summary.

<img src="screenshots/resource-detail.png" alt="Resource detail view" width="280">

**Duplicate detection**

Before saving, the app checks for similar existing entries so the library stays clean.

<img src="screenshots/duplicate-detection.png" alt="Duplicate detection prompt" width="280">

## Key Features

- **Scan-to-save**: Point a phone camera at any flyer and AI handles the data entry
- **Smart organization**: Resources are sorted into categories (housing, food, mental health, employment, legal, and more) with a searchable, collapsible library view
- **Duplicate detection**: Before saving, the app checks for similar existing entries and lets staff confirm, merge, or skip, so the library doesn't get cluttered
- **Smart expiration handling**: One-time events, recurring programs, and open-ended resources are each treated differently, so time-sensitive flyers age out automatically while ongoing programs stay listed
- **Edit anytime**: Any field can be corrected after scanning without having to rescan
- **Staff and public views**: Staff log in to add and manage resources, while a separate read-only view lets clients browse the library without an account
- **Mobile-first**: Built for quick use on a phone, with support for both photo library uploads and live camera capture

## Tech Stack

- Frontend: HTML, CSS, and JavaScript (single file, no frameworks)
- Backend: Supabase (database, authentication, file storage, serverless functions)
- AI: Anthropic Claude (vision model) for flyer data extraction
- Hosting: Netlify

## Why This Approach

The app was built as a single, self-contained file so it could be deployed and maintained without a local development environment. Drag, drop, done. That made it possible to iterate quickly and kept the deployment process simple enough for a small team to maintain long term.

## Status

Actively used by the team and expanding to a second team within the organization. Authentication and access controls are in place and locked down. Recent work added multilingual flyer support, so the app detects a flyer's language and keeps saved entries readable in that language, and closed a storage cleanup gap so images from deleted resources or discarded duplicate scans no longer pile up over time.
