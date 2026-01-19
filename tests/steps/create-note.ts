import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd()

Given('I am on the login page', async ({ page }) => {
    await page.goto('/login')
})

Given('I log in with email {string} and password {string}', async ({ page }, email, password) => {
    await page.fill('input#email', email)
    await page.fill('input#password', password)
    await page.click('button[type="submit"]')
    await page.waitForURL('**/notes')
})

When('I go to the {string} page', async ({ page }, pageName) => {
    await page.goto('/notes/new')
})

When('I fill the title with {string}', async ({ page }, title) => {
    const titleInput = page.locator('input#title')
    await titleInput.waitFor({ state: 'visible' })
    await titleInput.focus()
    await titleInput.fill(title)
})

When('I fill the content with {string}', async ({ page }, content) => {
    const editor = page.locator('.ProseMirror')
    await editor.waitFor({ state: 'visible' })
    await editor.focus()
    await editor.fill(content)
})

When('I click the save button', async ({ page }) => {
    await page.getByRole('button', { name: /save note/i }).click()
})

Then('I should be redirected to the notes list', async ({ page }) => {
    await expect(page).toHaveURL('/notes')
})

Then('I should see the note {string} in the list', async ({ page }, title) => {
    await expect(page.getByText(title)).toBeVisible()
})