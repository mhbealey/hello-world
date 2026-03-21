import { test, expect } from "@playwright/test";

test.describe("Smoke tests", () => {
  test("health endpoint returns ok", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.status).toBe("ok");
  });

  test("unauthenticated user is redirected to login", async ({ page }) => {
    await page.goto("/home");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page renders", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h2")).toContainText("Sign in");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("signup page renders", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.locator("h2")).toContainText("Create account");
  });

  test("login page has link to signup", async ({ page }) => {
    await page.goto("/login");
    const signupLink = page.locator('a[href="/signup"]');
    await expect(signupLink).toBeVisible();
  });

  test("dev component gallery renders", async ({ page }) => {
    await page.goto("/dev/components");
    await expect(page.locator("h1")).toContainText("Component Gallery");
  });
});
