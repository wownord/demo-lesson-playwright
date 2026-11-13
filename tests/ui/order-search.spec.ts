import { faker } from '@faker-js/faker/locale/en'
import { expect, test } from '@playwright/test'
import { PASSWORD, USERNAME } from '../../config/env-data'
import { LoginPage } from '../pages/login-page'
import { OrderPage } from '../pages/order-page'

let orderPage: OrderPage

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  orderPage = await loginPage.signIn(USERNAME, PASSWORD)
  await orderPage.verifyIsOpened()
})

test('search non-existing order opens "Order not found" page', async () => {
  const orderNotFoundPage = await orderPage.searchNonExistingOrder(0)

  await orderNotFoundPage.verifyIsOpened()
  await expect(orderNotFoundPage.title).toHaveText('Order not found')
  await expect(orderNotFoundPage.description).toHaveText('Check the tracking code')
  // common elements from AuthorizedPage and BasePage
  await orderNotFoundPage.verifyHeader()
  await orderNotFoundPage.verifyFooter()
})

test('create order and find it by tracking code', async () => {
  const name = faker.person.firstName().slice(0, 12)
  const phone = faker.string.numeric(8)
  const comment = 'homework 18'

  await orderPage.createOrder(name, phone, comment)
  await orderPage.verifyOrderCreated()
  const trackingCode = await orderPage.getTrackingCode()
  await orderPage.closeSuccessPopup()

  const orderFoundPage = await orderPage.searchExistingOrder(trackingCode)

  await orderFoundPage.verifyIsOpened()
  await orderFoundPage.verifyOrderDetails(name, phone, comment)
  await orderFoundPage.verifyHeader()
  await orderFoundPage.verifyFooter()
})

test('logout from "Order not found" page', async ({ page }) => {
  const orderNotFoundPage = await orderPage.searchNonExistingOrder(0)
  await orderNotFoundPage.verifyIsOpened()

  // logout comes from AuthorizedPage, so it works on every authorized page
  await orderNotFoundPage.clickLogout()

  await expect(page).toHaveURL(/\/signin$/)
  await new LoginPage(page).verifyIsOpened()
})
