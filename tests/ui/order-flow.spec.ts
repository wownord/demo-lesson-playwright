import { faker } from '@faker-js/faker/locale/en'
import { expect, test } from '@playwright/test'
import { PASSWORD, USERNAME } from '../../config/env-data'
import { LoginPage } from '../pages/login-page'
import { OrderPage } from '../pages/order-page'

let orderPage: OrderPage

// every scenario starts with a logged in user on the "Create order" page
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  orderPage = await loginPage.signIn(USERNAME, PASSWORD)
  await orderPage.verifyIsOpened()
})

test('login and verify elements on the order creation page', async () => {
  await orderPage.verifyIsOpened()
  await orderPage.verifyFooter()
  await expect(orderPage.createOrderButton).toBeEnabled()
})

test('login and create order successfully', async () => {
  // name and phone: 2-12 characters / 6-12 characters
  const name = faker.person.firstName().slice(0, 12)
  const phone = faker.string.numeric(8)

  await orderPage.createOrder(name, phone, 'homework 17')

  await orderPage.verifyOrderCreated()
})

test('login and verify validation errors when creating order', async () => {
  await orderPage.fillOrderForm('a', '12')
  await orderPage.nameField.blur()
  await orderPage.phoneField.blur()

  await expect(orderPage.nameError).toHaveText('The field must contain at least of characters: 2')
  await expect(orderPage.phoneError).toHaveText('The field must contain at least of characters: 6')
  await expect(orderPage.createOrderButton).toBeDisabled()

  // valid values remove the errors and enable the button
  await orderPage.fillOrderForm('Anna', '55443322')
  await expect(orderPage.nameError).toBeEmpty()
  await expect(orderPage.phoneError).toBeEmpty()
  await expect(orderPage.createOrderButton).toBeEnabled()
})

test('logout', async ({ page }) => {
  const loginPage = await orderPage.logout()

  await expect(page).toHaveURL(/\/signin$/)
  await loginPage.verifyIsOpened()
  await expect(orderPage.logoutButton).toBeHidden()
})
