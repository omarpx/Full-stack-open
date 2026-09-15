const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await expect(page.getByText('Log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username/password')).toBeVisible()
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('link', { name: 'create new blog' }).click()
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill('a blog')
      await page.getByPlaceholder('author').fill('omarp')
      await page.getByPlaceholder('url').fill('http://playwright.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('a blog omarp')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('link', { name: 'create new blog' }).click()
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill('a blog')
      await page.getByPlaceholder('author').fill('omarp')
      await page.getByPlaceholder('url').fill('http://playwright.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByText('a blog omarp').click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(1000)

      await expect(page.getByText('likes 1', { exact: false })).toBeVisible()
    })

    test('blog can be deleted', async ({ page }) => {
      await page.getByRole('link', { name: 'create new blog' }).click()
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill('a blog to delete')
      await page.getByPlaceholder('author').fill('omarp')
      await page.getByPlaceholder('url').fill('http://playwright.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByText('a blog to delete omarp').click()

      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('a blog to delete omarp')).not.toBeVisible()
    })
  })
})