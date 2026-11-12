import { expect, Locator, Page, test } from '@playwright/test'
import { SERVICE_URL } from '../../config/env-data'
import { BasePage } from './base-page'
import { OrderPage } from './order-page'

export class LoginPage extends BasePage {
  readonly url: string = SERVICE_URL
  readonly signInButton: Locator
  readonly usernameField: Locator
  readonly passwordField: Locator

  constructor(page: Page) {
    super(page)
    this.signInButton = page.getByTestId('signIn-button')
    this.usernameField = page.getByTestId('username-input')
    this.passwordField = page.getByTestId('password-input')
  }

  async open(): Promise<void> {
    await this.page.goto(this.url)
  }

  async signIn(username: string, password: string): Promise<OrderPage> {
    await this.fillElement(this.usernameField, username)
    await this.fillElement(this.passwordField, password)
    await this.clickElement(this.signInButton)
    return new OrderPage(this.page)
  }

  async verifyIsOpened(): Promise<void> {
    await test.step('Verify login page is opened', async () => {
      await this.checkElementVisibility(this.usernameField)
      await this.checkElementVisibility(this.passwordField)
      await expect(this.signInButton).toBeVisible()
    })
  }
}
