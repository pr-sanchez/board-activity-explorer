import { test, expect } from "@playwright/test";

test.describe("Board Activity Explorer", () => {
  test("loads and displays the board header", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Board Activity Explorer" }),
    ).toBeVisible();
  });

  test("shows notes count after loading", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/\d+ sticky notes/)).toBeVisible();
  });
});
