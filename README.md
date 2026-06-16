# ResourceFile - Team Toolkit

A web app that turns paper community resource flyers into a searchable, shared digital library. Built for a social services case management team.

**Live app:** [rezourcescanner.netlify.app](https://rezourcescanner.netlify.app)

## Problem

Case managers collect physical flyers for housing, food, mental health, and other community resources, but flyers get lost, go out of date, and aren't searchable. There was no shared way for staff to know what resources existed or whether they were still current.

## Solution

Staff scan a flyer with their phone camera. AI reads the flyer and pulls out the resource name, category, contact info, hours, eligibility requirements, and services offered, then saves it to a shared library the whole team can search and browse.

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

Actively used by the team. Recent work focused on securing the app with proper authentication and access controls ahead of a broader rollout.
