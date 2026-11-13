import { Locator, Page, test } from '@playwright/test'
import { AuthorizedPage } from './authorized-page'

// page shown when the searched tracking code does not exist
export class OrderNotFoundPage extends AuthorizedPage {
  readonly container: Locator
  readonly title: Locator
  readonly description: Locator
  readonly image: Locator

  constructor(page: Page) {
    super(page)
    this.container = page.getByTestId('orderNotFound-container')
    this.title = page.getByTestId('orderNotFound-title')
    this.description = page.getByTestId('orderNotFound-description')
    this.image = page.getByTestId('orderNotFound-image')
  }

  async verifyIsOpened(): Promise<void> {
    await test.step('Verify "Order not found" page', async () => {
      for (const element of [this.container, this.title, this.description, this.image]) {
        await this.checkElementVisibility(element)
      }
    })
  }
}
