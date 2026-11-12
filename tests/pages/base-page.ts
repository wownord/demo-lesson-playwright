import { expect, Locator, Page, test } from '@playwright/test'

// common elements of every page: header and footer
export abstract class BasePage {
  readonly page: Page
  readonly logoLink: Locator
  readonly statusButton: Locator
  readonly languageSwitcher: Locator
  readonly languageEnButton: Locator
  readonly languageRuButton: Locator
  readonly languageEtButton: Locator
  readonly privacyPolicyLink: Locator
  readonly cookiePolicyLink: Locator
  readonly termsOfServiceLink: Locator
  readonly TIMEOUT_VISIBILITY: number = 5000

  protected constructor(page: Page) {
    this.page = page
    this.logoLink = page.getByTestId('mainPage-link')
    this.statusButton = page.getByTestId('openStatusPopup-button')
    this.languageSwitcher = page.getByTestId('language-switcher')
    this.languageEnButton = page.getByTestId('language-en')
    this.languageRuButton = page.getByTestId('language-ru')
    this.languageEtButton = page.getByTestId('language-et')
    this.privacyPolicyLink = page.getByTestId('privacy-policy')
    this.cookiePolicyLink = page.getByTestId('cookie-policy')
    this.termsOfServiceLink = page.getByTestId('terms-of-service')
  }

  async checkElementVisibility(element: Locator): Promise<void> {
    await test.step(`Verifying element visibility: ${element}`, async () => {
      await expect(element).toBeVisible({ timeout: this.TIMEOUT_VISIBILITY })
    })
  }

  async verifyFooter(): Promise<void> {
    await test.step('Verify footer: language switcher and documents', async () => {
      for (const element of [
        this.languageEnButton,
        this.languageRuButton,
        this.languageEtButton,
        this.privacyPolicyLink,
        this.cookiePolicyLink,
        this.termsOfServiceLink,
      ]) {
        await this.checkElementVisibility(element)
      }
    })
  }

  async clickElement(element: Locator): Promise<void> {
    await test.step(`Clicking element: ${element}`, async () => {
      await element.click()
    })
  }

  async fillElement(element: Locator, text: string): Promise<void> {
    await test.step(`Filling element: ${element}`, async () => {
      await element.fill(text)
    })
  }
}
