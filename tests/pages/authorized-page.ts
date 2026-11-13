import { expect, Locator, Page, test } from '@playwright/test'
import { BasePage } from './base-page'

// common header elements of pages available only for a logged in user:
// "Status" button with order search popup and "Logout" button
export abstract class AuthorizedPage extends BasePage {
  readonly statusButton: Locator
  readonly logoutButton: Locator
  readonly searchOrderPopup: Locator
  readonly searchOrderInput: Locator
  readonly searchOrderSubmitButton: Locator

  protected constructor(page: Page) {
    super(page)
    this.statusButton = page.getByTestId('openStatusPopup-button')
    this.logoutButton = page.getByTestId('logout-button')
    this.searchOrderPopup = page.getByTestId('searchOrder-popup')
    this.searchOrderInput = page.getByTestId('searchOrder-input')
    this.searchOrderSubmitButton = page.getByTestId('searchOrder-submitButton')
  }

  async verifyHeader(): Promise<void> {
    await test.step('Verify authorized header: Status and Logout buttons', async () => {
      await this.checkElementVisibility(this.statusButton)
      await this.checkElementVisibility(this.logoutButton)
    })
  }

  async searchOrder(orderId: number | string): Promise<void> {
    await test.step(`Search order by tracking code: ${orderId}`, async () => {
      await this.clickElement(this.statusButton)
      await expect(this.searchOrderInput).toBeVisible()
      await this.fillElement(this.searchOrderInput, String(orderId))
      await this.clickElement(this.searchOrderSubmitButton)
    })
  }

  async clickLogout(): Promise<void> {
    await this.clickElement(this.logoutButton)
  }
}
