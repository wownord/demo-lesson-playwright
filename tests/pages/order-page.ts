import { expect, Locator, Page, test } from '@playwright/test'
import { BasePage } from './base-page'
import { LoginPage } from './login-page'

// "Create order" page: available only for a logged in user
export class OrderPage extends BasePage {
  readonly title: Locator
  readonly logoutButton: Locator
  readonly nameField: Locator
  readonly nameError: Locator
  readonly phoneField: Locator
  readonly phoneError: Locator
  readonly commentField: Locator
  readonly createOrderButton: Locator
  readonly successPopup: Locator
  readonly successPopupWrapper: Locator
  readonly successPopupOkButton: Locator

  constructor(page: Page) {
    super(page)
    this.title = page.getByRole('heading', { name: 'Create order' })
    this.logoutButton = page.getByTestId('logout-button')
    this.nameField = page.getByTestId('username-input')
    this.nameError = page.getByTestId('username-input-error')
    this.phoneField = page.getByTestId('phone-input')
    this.phoneError = page.getByTestId('phone-input-error')
    this.commentField = page.getByTestId('comment-input')
    this.createOrderButton = page.getByTestId('createOrder-button')
    this.successPopup = page.getByTestId('orderSuccessfullyCreated-popup')
    // popup is always in the DOM, it is shown with the "popup_opened" class on its wrapper
    this.successPopupWrapper = page.locator('.popup', { has: this.successPopup })
    this.successPopupOkButton = page.getByTestId('orderSuccessfullyCreated-popup-ok-button')
  }

  async verifyIsOpened(): Promise<void> {
    await test.step('Verify order creation page elements', async () => {
      for (const element of [
        this.title,
        this.statusButton,
        this.logoutButton,
        this.nameField,
        this.phoneField,
        this.commentField,
        this.createOrderButton,
      ]) {
        await this.checkElementVisibility(element)
      }
    })
  }

  async fillOrderForm(name: string, phone: string, comment = ''): Promise<void> {
    await this.fillElement(this.nameField, name)
    await this.fillElement(this.phoneField, phone)
    await this.fillElement(this.commentField, comment)
  }

  async createOrder(name: string, phone: string, comment = ''): Promise<void> {
    await this.fillOrderForm(name, phone, comment)
    await this.clickElement(this.createOrderButton)
  }

  async verifyOrderCreated(): Promise<void> {
    await test.step('Verify "Order has been created" popup', async () => {
      await expect(this.successPopupWrapper).toHaveClass(/popup_opened/)
      await expect(this.successPopup).toContainText('Order has been created!')
      await expect(this.successPopup).toContainText(/Tracking code: \d+/)
    })
  }

  async logout(): Promise<LoginPage> {
    await this.clickElement(this.logoutButton)
    return new LoginPage(this.page)
  }
}
