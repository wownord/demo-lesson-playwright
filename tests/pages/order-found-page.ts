import { expect, Locator, Page, test } from '@playwright/test'
import { AuthorizedPage } from './authorized-page'

// order details page shown when the searched tracking code exists
export class OrderFoundPage extends AuthorizedPage {
  readonly customerName: Locator
  readonly customerPhone: Locator
  readonly comment: Locator
  readonly openStatusActive: Locator
  readonly acceptedStatus: Locator
  readonly inProgressStatus: Locator
  readonly deliveredStatus: Locator

  constructor(page: Page) {
    super(page)
    this.customerName = page.getByTestId('customerName-value')
    this.customerPhone = page.getByTestId('customerPhone-value')
    this.comment = page.getByTestId('comment-value')
    this.openStatusActive = page.getByTestId('status-OPEN-active')
    this.acceptedStatus = page.getByTestId('status-ACCEPTED')
    this.inProgressStatus = page.getByTestId('status-INPROGRESS')
    this.deliveredStatus = page.getByTestId('status-DELIVERED')
  }

  async verifyIsOpened(): Promise<void> {
    await test.step('Verify order details page', async () => {
      for (const element of [
        this.customerName,
        this.customerPhone,
        this.openStatusActive,
        this.acceptedStatus,
        this.inProgressStatus,
        this.deliveredStatus,
      ]) {
        await this.checkElementVisibility(element)
      }
    })
  }

  async verifyOrderDetails(name: string, phone: string, comment: string): Promise<void> {
    await test.step('Verify order details', async () => {
      await expect(this.customerName).toHaveText(name)
      await expect(this.customerPhone).toHaveText(phone)
      await expect(this.comment).toHaveText(comment)
    })
  }
}
