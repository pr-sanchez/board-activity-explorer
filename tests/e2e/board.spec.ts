import { test, expect } from "@playwright/test";

test.describe("Board Activity Explorer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("article");
  });

  test("renders header and 100 sticky notes", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Board Activity Explorer" }),
    ).toBeVisible();
    await expect(page.locator("article[role='listitem']")).toHaveCount(100);
  });

  test("filters notes by author and resets", async ({ page }) => {
    await page.getByLabel("Filters").locator("label", { hasText: "user_1" }).click();
    const filtered = await page.locator("article[role='listitem']").count();
    expect(filtered).toBeLessThan(100);

    await page.getByRole("button", { name: "Reset filters" }).click();
    await expect(page.locator("article[role='listitem']")).toHaveCount(100);
  });

  test("searches notes by text", async ({ page }) => {
    await page.getByPlaceholder("Search notes...").fill("login");
    const count = await page.locator("article[role='listitem']").count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(100);
  });

  test("auto-groups and ungroups notes", async ({ page }) => {
    await page.getByRole("button", { name: "Auto-group by topic" }).click();
    expect(await page.locator("h3").count()).toBeGreaterThan(1);

    await page.getByRole("button", { name: "Ungroup notes" }).click();
    expect(await page.locator("h3").count()).toBe(0);
  });

  test("voting session shows and hides vote buttons", async ({ page }) => {
    await expect(page.locator("article button")).toHaveCount(0);

    await page.getByRole("button", { name: "Start voting session" }).click();
    await expect(page.locator("article button").first()).toBeVisible({ timeout: 5000 });

    await page.getByRole("button", { name: "End voting session" }).click();
    await expect(page.locator("article button")).toHaveCount(0, { timeout: 5000 });
  });
});
