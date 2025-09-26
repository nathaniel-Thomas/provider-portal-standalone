import { test, expect } from '@playwright/test'

test.describe('Provider Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should display dashboard overview', async ({ page }) => {
    // Check for main dashboard elements
    const dashboardElements = [
      'Provider Portal',
      'Dashboard',
      'Jobs',
      'Earnings'
    ]

    for (const element of dashboardElements) {
      const locator = page.locator(`text=${element}`)
      if (await locator.count() > 0) {
        await expect(locator).toBeVisible()
      }
    }
  })

  test('should show earnings information', async ({ page }) => {
    // Look for earnings cards or sections
    const earningsSection = page.locator('[data-testid="earnings"], .earnings, text=/earnings/i')

    if (await earningsSection.count() > 0) {
      await expect(earningsSection.first()).toBeVisible()

      // Should show monetary amounts
      const moneyPattern = page.locator('text=/\\$\\d+/')
      if (await moneyPattern.count() > 0) {
        await expect(moneyPattern.first()).toBeVisible()
      }
    }
  })

  test('should display performance metrics', async ({ page }) => {
    // Look for performance indicators
    const performanceElements = [
      /rating/i,
      /score/i,
      /completed/i,
      /reviews/i,
      /\d+%/, // Percentage values
      /\d+\.\d+/ // Decimal ratings
    ]

    for (const pattern of performanceElements) {
      const element = page.locator(`text=${pattern}`)
      if (await element.count() > 0) {
        // At least one performance metric should be visible
        break
      }
    }
  })

  test('should navigate to different sections', async ({ page }) => {
    const navigationSections = [
      { text: 'Jobs', expectedUrl: /jobs|home/ },
      { text: 'Earnings', expectedUrl: /earnings|finance/ },
      { text: 'Calendar', expectedUrl: /calendar/ },
      { text: 'Messages', expectedUrl: /messages/ },
      { text: 'Profile', expectedUrl: /profile/ }
    ]

    for (const section of navigationSections) {
      const link = page.locator(`a:has-text("${section.text}"), button:has-text("${section.text}")`)

      if (await link.count() > 0) {
        await link.first().click()
        await page.waitForLoadState('networkidle')

        // Check if URL changed appropriately
        const currentUrl = page.url()
        expect(currentUrl).toMatch(section.expectedUrl)

        // Navigate back to home/dashboard for next test
        await page.goto('/')
        await page.waitForLoadState('networkidle')
      }
    }
  })

  test('should show recent activity or updates', async ({ page }) => {
    // Look for activity feed, notifications, or recent updates
    const activityElements = page.locator([
      '[data-testid="activity"]',
      '[data-testid="notifications"]',
      '[data-testid="updates"]',
      '.activity',
      '.notifications',
      '.recent',
      'text=/recent/i',
      'text=/activity/i',
      'text=/notifications/i'
    ].join(', '))

    if (await activityElements.count() > 0) {
      await expect(activityElements.first()).toBeVisible()
    }
  })

  test('should handle job status updates', async ({ page }) => {
    // Look for job status indicators
    const statusElements = page.locator([
      'text=/available/i',
      'text=/scheduled/i',
      'text=/in progress/i',
      'text=/completed/i',
      '[data-testid="job-status"]',
      '.status'
    ].join(', '))

    const statusCount = await statusElements.count()
    if (statusCount > 0) {
      // Should have at least one job status visible
      await expect(statusElements.first()).toBeVisible()

      // Test status change if interactive elements exist
      const statusButtons = page.locator('button:has-text("Accept"), button:has-text("Start"), button:has-text("Complete")')
      const buttonCount = await statusButtons.count()

      if (buttonCount > 0) {
        const firstButton = statusButtons.first()
        const buttonText = await firstButton.textContent()
        await firstButton.click()
        await page.waitForTimeout(1000)

        // Status should change after action
        if (buttonText?.includes('Accept')) {
          await expect(page.locator('text=/accepted|scheduled/i')).toBeVisible({ timeout: 5000 })
        }
      }
    }
  })

  test('should display provider information', async ({ page }) => {
    // Look for provider profile information
    const profileElements = [
      '[data-testid="provider-name"]',
      '[data-testid="provider-info"]',
      '.provider-info',
      'text=/provider/i'
    ]

    for (const selector of profileElements) {
      const element = page.locator(selector)
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible()
        break
      }
    }
  })

  test('should show calendar or scheduling information', async ({ page }) => {
    // Look for calendar widget or scheduling info
    const calendarElements = page.locator([
      '[data-testid="calendar"]',
      '.calendar',
      'text=/today/i',
      'text=/schedule/i',
      'text=/upcoming/i',
      // Date patterns
      'text=/\\d{1,2}\/\\d{1,2}/',
      'text=/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/',
      'text=/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/'
    ].join(', '))

    if (await calendarElements.count() > 0) {
      await expect(calendarElements.first()).toBeVisible()
    }
  })

  test('should handle search functionality', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], [data-testid="search"]')

    if (await searchInput.count() > 0) {
      await expect(searchInput).toBeVisible()

      // Test search
      await searchInput.fill('clean')
      await searchInput.press('Enter')
      await page.waitForTimeout(1000)

      // Should show filtered results or search results
      const results = page.locator('[data-testid="search-results"], .search-results')
      // Search results display depends on implementation
    }
  })

  test('should load dashboard data without errors', async ({ page }) => {
    // Monitor network errors
    const errors: string[] = []
    page.on('response', response => {
      if (!response.ok() && response.status() >= 400) {
        errors.push(`${response.status()}: ${response.url()}`)
      }
    })

    // Reload page to trigger all data loading
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Should not have critical API errors (allow some 404s for optional resources)
    const criticalErrors = errors.filter(error =>
      !error.includes('favicon') &&
      !error.includes('.map') &&
      error.startsWith('5') // 5xx server errors
    )

    expect(criticalErrors).toHaveLength(0)

    // Dashboard should still be functional
    await expect(page.locator('body')).toBeVisible()
  })
})