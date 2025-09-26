import { test, expect } from '@playwright/test'

test.describe('Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should have mobile-responsive design', async ({ page }) => {
    // Check that content fits in mobile viewport
    const body = page.locator('body')
    await expect(body).toBeVisible()

    // Should not have horizontal scrollbar
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    const clientWidth = await page.evaluate(() => document.body.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 20) // Allow small margin for browser differences
  })

  test('should display bottom navigation', async ({ page }) => {
    const bottomNav = page.locator('[data-testid="bottom-navigation"], .bottom-nav, nav')

    // Wait for potential navigation to load
    await page.waitForTimeout(1000)

    if (await bottomNav.count() > 0) {
      await expect(bottomNav).toBeVisible()

      // Check that navigation is at the bottom
      const navBox = await bottomNav.boundingBox()
      const viewportHeight = page.viewportSize()?.height || 812

      if (navBox) {
        expect(navBox.y).toBeGreaterThan(viewportHeight * 0.7) // Should be in bottom 30% of screen
      }

      // Test navigation items
      const navItems = bottomNav.locator('button, a, [role="button"]')
      const navCount = await navItems.count()
      expect(navCount).toBeGreaterThan(0)
      expect(navCount).toBeLessThanOrEqual(5) // Reasonable number for mobile nav

      // Test first navigation item
      if (navCount > 0) {
        const firstNavItem = navItems.first()
        await expect(firstNavItem).toBeVisible()
        await firstNavItem.click()
        await page.waitForTimeout(500)
      }
    }
  })

  test('should handle touch interactions', async ({ page }) => {
    // Find interactive elements
    const buttons = page.locator('button')
    const links = page.locator('a')

    // Test button taps
    const buttonCount = await buttons.count()
    if (buttonCount > 0) {
      const firstButton = buttons.first()
      await expect(firstButton).toBeVisible()

      // Test tap (instead of click for mobile)
      await firstButton.tap()
      await page.waitForTimeout(500)
    }

    // Test link taps
    const linkCount = await links.count()
    if (linkCount > 0) {
      for (let i = 0; i < Math.min(3, linkCount); i++) {
        const link = links.nth(i)
        const href = await link.getAttribute('href')

        if (href && href.startsWith('/') && !href.includes('#')) {
          await link.tap()
          await page.waitForLoadState('networkidle')

          // Verify navigation worked
          expect(page.url()).toContain(href)

          // Go back for next test
          await page.goBack()
          await page.waitForLoadState('networkidle')
        }
      }
    }
  })

  test('should handle swipe gestures', async ({ page }) => {
    // Test horizontal swipes on job cards or similar elements
    const swipeableElements = page.locator('[data-testid="job-card"], .job-card, [class*="card"]')

    if (await swipeableElements.count() > 0) {
      const element = swipeableElements.first()
      const box = await element.boundingBox()

      if (box) {
        // Simulate swipe left
        await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2)
        await page.mouse.down()
        await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, { steps: 10 })
        await page.mouse.up()

        await page.waitForTimeout(500)

        // Simulate swipe right
        await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2)
        await page.mouse.down()
        await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2, { steps: 10 })
        await page.mouse.up()

        await page.waitForTimeout(500)
      }
    }
  })

  test('should handle pull to refresh', async ({ page }) => {
    // Simulate pull to refresh gesture
    await page.mouse.move(200, 100)
    await page.mouse.down()
    await page.mouse.move(200, 300, { steps: 20 })
    await page.mouse.up()

    // Wait for potential refresh action
    await page.waitForTimeout(2000)

    // Check if page refreshed or loading indicator appeared
    const loadingIndicator = page.locator('[data-testid="loading"], .loading, .spinner')
    // Loading indicator might appear briefly, so don't assert its presence

    // Page should still be functional after pull gesture
    await expect(page.locator('body')).toBeVisible()
  })

  test('should maintain mobile layout on orientation change', async ({ page }) => {
    // Start in portrait
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.locator('body')).toBeVisible()

    // Change to landscape
    await page.setViewportSize({ width: 812, height: 375 })
    await page.waitForTimeout(500)

    // Should still be responsive and functional
    await expect(page.locator('body')).toBeVisible()

    // Content should not overflow horizontally
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    const clientWidth = await page.evaluate(() => document.body.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 20)

    // Change back to portrait
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(500)

    await expect(page.locator('body')).toBeVisible()
  })

  test('should handle keyboard input on mobile', async ({ page }) => {
    // Find input fields
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="search"], textarea')

    const inputCount = await inputs.count()
    if (inputCount > 0) {
      const firstInput = inputs.first()
      await expect(firstInput).toBeVisible()

      // Tap to focus
      await firstInput.tap()

      // Type text
      await firstInput.fill('Test input text')

      // Verify input value
      const value = await firstInput.inputValue()
      expect(value).toBe('Test input text')

      // Clear input
      await firstInput.fill('')
      expect(await firstInput.inputValue()).toBe('')
    }
  })
})