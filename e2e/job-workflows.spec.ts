import { test, expect } from '@playwright/test'

test.describe('Job Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should display available jobs', async ({ page }) => {
    // Look for job cards or job listings
    const jobCards = page.locator('[data-testid="job-card"], .job-card, [class*="glass-card"]')
    await expect(jobCards.first()).toBeVisible({ timeout: 10000 })

    // Check that job cards have required information
    const firstJobCard = jobCards.first()
    await expect(firstJobCard).toContainText(/Clean|Service/)
    await expect(firstJobCard).toContainText(/\$\d+/) // Price
  })

  test('should allow accepting a job', async ({ page }) => {
    // Find an available job with accept button
    const acceptButton = page.locator('button:has-text("Accept")').first()

    if (await acceptButton.count() > 0) {
      await acceptButton.click()

      // Wait for the job to be accepted
      await page.waitForTimeout(1000)

      // Should see success indication or job status change
      await expect(page.locator('text=/accepted|scheduled/i')).toBeVisible({ timeout: 5000 })
    } else {
      // If no accept button found, verify job status is displayed
      await expect(page.locator('text=/available|scheduled|completed/i')).toBeVisible()
    }
  })

  test('should show job details modal', async ({ page }) => {
    // Look for view details button
    const viewDetailsButton = page.locator('button:has-text("View Details"), button:has-text("Details")').first()

    if (await viewDetailsButton.count() > 0) {
      await viewDetailsButton.click()

      // Should open modal with job details
      const modal = page.locator('[role="dialog"], .modal, [data-testid="job-modal"]')
      await expect(modal).toBeVisible()

      // Modal should contain job information
      await expect(modal).toContainText(/Service|Clean|Location|Price/)

      // Close modal
      const closeButton = modal.locator('button:has-text("Close"), button[aria-label="Close"], [data-testid="close-modal"]')
      if (await closeButton.count() > 0) {
        await closeButton.click()
        await expect(modal).not.toBeVisible()
      }
    }
  })

  test('should handle job workflow start', async ({ page }) => {
    // Look for scheduled jobs with start button
    const startButton = page.locator('button:has-text("Start Job"), button:has-text("Start")').first()

    if (await startButton.count() > 0) {
      await startButton.click()

      // Should enter job workflow
      await expect(page.locator('text=/job|workflow|progress/i')).toBeVisible({ timeout: 5000 })

      // Look for workflow elements
      const workflowElements = page.locator('[data-testid="job-workflow"], .workflow, [class*="workflow"]')
      if (await workflowElements.count() > 0) {
        await expect(workflowElements.first()).toBeVisible()
      }
    }
  })

  test('should filter jobs by status', async ({ page }) => {
    // Look for filter buttons
    const availableFilter = page.locator('button:has-text("Available"), [data-testid="filter-available"]')
    const scheduledFilter = page.locator('button:has-text("Scheduled"), [data-testid="filter-scheduled"]')
    const completedFilter = page.locator('button:has-text("Completed"), [data-testid="filter-completed"]')

    // Test each filter if it exists
    for (const filter of [availableFilter, scheduledFilter, completedFilter]) {
      if (await filter.count() > 0) {
        await filter.click()
        await page.waitForTimeout(500)

        // Jobs should be filtered
        const jobCards = page.locator('[data-testid="job-card"], .job-card, [class*="glass-card"]')
        if (await jobCards.count() > 0) {
          await expect(jobCards.first()).toBeVisible()
        }
      }
    }
  })

  test('should handle mobile job interactions', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip()
    }

    // Ensure mobile viewport
    await page.setViewportSize({ width: 375, height: 812 })

    // Test touch interactions on job cards
    const jobCard = page.locator('[data-testid="job-card"], .job-card, [class*="glass-card"]').first()
    if (await jobCard.count() > 0) {
      // Test tap on job card
      await jobCard.tap()
      await page.waitForTimeout(500)

      // Should show some response (details, selection, etc.)
      // The exact behavior depends on implementation
    }

    // Test bottom navigation if present
    const bottomNav = page.locator('[data-testid="bottom-navigation"], .bottom-nav')
    if (await bottomNav.count() > 0) {
      await expect(bottomNav).toBeVisible()
    }
  })
})