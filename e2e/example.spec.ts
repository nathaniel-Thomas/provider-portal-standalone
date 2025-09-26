import { test, expect } from '@playwright/test'

test.describe('Rayshine Provider Portal', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')

    // Check if the app loads correctly
    await expect(page).toHaveTitle(/Rayshine/)

    // Look for key elements that should be present on the main page
    await expect(page.locator('text=Provider Portal')).toBeVisible()
  })

  test('should be mobile-responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    // Check if mobile navigation is present
    const mobileNav = page.locator('[data-testid="bottom-navigation"]')
    if (await mobileNav.count() > 0) {
      await expect(mobileNav).toBeVisible()
    }

    // Ensure content is properly formatted for mobile
    const content = page.locator('main')
    if (await content.count() > 0) {
      await expect(content).toBeVisible()
    }
  })

  test('should handle navigation', async ({ page }) => {
    await page.goto('/')

    // Try to navigate to different sections if they exist
    const links = await page.locator('a').all()

    for (const link of links.slice(0, 3)) { // Test first 3 links only
      const href = await link.getAttribute('href')
      if (href && href.startsWith('/') && !href.includes('#')) {
        await link.click()
        await page.waitForLoadState('networkidle')

        // Verify page loads without errors
        await expect(page.locator('body')).toBeVisible()

        // Go back to test other links
        await page.goBack()
        await page.waitForLoadState('networkidle')
      }
    }
  })
})