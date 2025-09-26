# Rayshine Provider Portal: Features & User Flows

This document outlines the core features and user flows for the Rayshine Provider Portal. The goal is to create a user-centric application that empowers providers, reduces administrative friction, and builds trust. The design philosophy is heavily inspired by successful provider apps like Booking Koala, focusing on clarity, efficiency, and mobile-first usability.

---

## 1. Core Features

### 1.1. Provider Onboarding
- **Goal:** A seamless, guided setup process to get a provider from sign-up to "ready for jobs" as quickly as possible.
- **Relevant Files:** `ProviderOnboarding.tsx`, `PersonalInformation.tsx`, `ServiceArea.tsx`, `BankingPayouts.tsx`
- **Features:**
    - Multi-step progress tracker (e.g., "Step 1 of 4: Personal Info").
    - Input validation with clear, inline error messages.
    - Ability to save progress and return later.
    - Document uploads for certifications, ID, etc.
    - Final review screen before submission.

### 1.2. Action-Oriented Dashboard
- **Goal:** Provide an "at-a-glance" summary of what the provider needs to know and do *right now*.
- **Relevant Files:** `Home.tsx`, `AnimatedCard.tsx`, `BookingOverview.tsx`, `EarningsCard.tsx`
- **Features:**
    - **"Up Next" Card:** Displays the very next upcoming job with critical details (time, address, service type).
    - **"Action Items" List:** A dynamic list of tasks needing attention (e.g., "Confirm 2 new job offers," "Upload documents for Job #1234").
    - **Weekly Earnings Snapshot:** A summary of earnings for the current week.
    - **Performance Metrics:** High-level view of provider rating or other key metrics.

### 1.3. Job Management
- **Goal:** A clear and comprehensive system for viewing, accepting, and managing the entire lifecycle of a job.
- **Relevant Files:** `JobCard.tsx`, `JobDetailsModal.tsx`, `Calendar.tsx`, `FilterButtons.tsx`
- **Features:**
    - **Tabbed Job Lists:** Separate lists for "New Offers," "Upcoming," and "Completed."
    - **Detailed Job View:** A modal or separate page showing all job details, including customer notes, address (with a map link), and required documentation.
    - **Clear Action Buttons:** Context-aware buttons on job cards (e.g., "Accept," "Decline," "Check-In," "Upload Photos").
    - **Calendar View:** A visual representation of the provider's schedule.

### 1.4. Financial Hub
- **Goal:** Provide complete transparency into earnings, deductions, and payouts to build trust.
- **Relevant Files:** `Finance.tsx`, `BankingPayouts.tsx`
- **Features:**
    - **Earnings Dashboard:** Shows current balance, estimated next payout date, and a graph of earnings over time.
    - **Transaction History:** An itemized list of all financial events (jobs completed, tips received, fees deducted).
    - **Detailed Payout Slips:** For each payout, a detailed breakdown of all jobs included in that payment.
    - **Payout Settings Management:** Allow providers to easily view and update their banking information.

### 1.5. Profile & Settings
- **Goal:** A central place for providers to manage their personal information, availability, and app settings.
- **Relevant Files:** `Profile.tsx`, `PersonalInformation.tsx`, `ServiceArea.tsx`
- **Features:**
    - **Edit Personal Information.**
    - **Manage Service Area:** A map-based or zip-code based tool to define where they are willing to work.
    - **Set Availability/Time Off:** A simple calendar interface to block off days or hours.
    - **Notification Preferences.**

---

## 2. Key User Flows

### 2.1. First-Time Onboarding Flow
1.  Provider creates an account and logs in for the first time.
2.  Is automatically redirected to the **Onboarding** page.
3.  Sees the progress tracker (e.g., "Step 1 of 4").
4.  Fills out **Personal Information** -> Clicks "Save & Continue."
5.  Defines their **Service Area** -> Clicks "Save & Continue."
6.  Enters **Banking/Payout** details -> Clicks "Save & Continue."
7.  Uploads required **Documents**.
8.  Submits profile for approval. The app now shows a "Profile under review" status on the dashboard.

### 2.2. Accepting a New Job Flow
1.  Provider receives a push notification about a new job offer.
2.  Opens the app, lands on the **Dashboard**, and sees "1 New Job Offer" in the Action Items list.
3.  Navigates to the **Job Management** section, on the "New Offers" tab.
4.  Taps a `JobCard` to open the `JobDetailsModal`.
5.  Reviews the details (pay, location, time, requirements).
6.  Clicks the **"Accept"** button.
7.  The job is removed from "New Offers" and now appears in their "Upcoming" list and on their `Calendar.tsx`.

### 2.3. Completing a Job Flow
1.  Provider arrives at the job location.
2.  Opens the app and finds the active job on their **Dashboard** or "Upcoming" jobs list.
3.  Clicks **"Check-In"** or **"Start Job"**. The job status updates.
4.  After finishing the work, they click **"Complete Job"**.
5.  A checklist appears prompting for required actions (e.g., "Upload 'After' Photo," "Submit Service Notes"). This uses `ServiceDocumentation.tsx` and `QualityControlDocumentation.tsx`.
6.  Once all requirements are met, the job moves to the "Completed" list and the earnings are reflected in the **Financial Hub**.

---

## 3. Analysis of Existing Project & Simplification

Based on the current file structure, the project is well-organized. However, there is one area for potential simplification:

- **Recommendation:** Merge `FinanceComplete.tsx` into `Finance.tsx`.

- **Rationale:**
    - The file `FinanceComplete.tsx` likely represents a specific state of the finance page (e.g., after a payout has been initiated).
    - This state can be handled more efficiently within the main `Finance.tsx` component using conditional rendering. For example, if a `payout_status` prop is 'complete', you can render a success banner at the top of the existing finance page.
    - **Benefit:** This reduces the number of top-level page components, simplifies routing logic, and creates a single, authoritative source for all finance-related UI, making the codebase easier to maintain and understand.
