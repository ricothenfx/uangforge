import { expect, test } from "@playwright/test";

test.describe("UangForge", () => {
  test("home renders hero and scenario picker", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Don't read about the AI Factory");
    await expect(page.getByPlaceholder(/Describe a small business app/)).toBeVisible();
    await expect(page.getByText("…or watch a scenario build")).toBeVisible();
    await expect(page.getByRole("button", { name: /Leave Tracker/ })).toBeVisible();
  });

  test("curated build runs the theater and ships a working app", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Leave Tracker/ }).click();

    // theater stages complete
    await expect(page.getByText("Plan — blueprint spec")).toBeVisible();
    await expect(page.getByText("blueprint.json — the whole app")).toBeVisible();
    await expect(page.getByText("Build — runtime modules")).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText("Test — real checks on the blueprint")).toBeVisible();
    await expect(page.getByText(/SHIPPED — Leave Tracker is live below/)).toBeVisible({ timeout: 45_000 });

    // runtime mounts with dashboard + views
    await expect(page.getByRole("button", { name: "request · table" })).toBeVisible();
    await expect(page.getByRole("button", { name: /New request/ })).toBeVisible();
    await expect(page.locator("table tbody tr").first()).toBeVisible();

    // shareable link appears
    await expect(page.getByRole("link", { name: /Open standalone/ })).toBeVisible({ timeout: 5_000 });
    const href = await page.getByRole("link", { name: /Open standalone/ }).getAttribute("href");
    expect(href).toContain("/app?bp=");
  });

  test("built app: create record via form, approve via human confirm", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Leave Tracker/ }).click();
    await expect(page.getByRole("button", { name: /New request/ })).toBeVisible({ timeout: 45_000 });

    const rowsBefore = await page.locator("tbody tr").count();
    await page.getByRole("button", { name: /New request/ }).click();
    await page.getByLabel("employee").fill("E2E Tester");
    await page.getByLabel("days").fill("3");
    await page.getByRole("button", { name: /Save request/ }).click();
    await expect(page.locator("tbody tr")).toHaveCount(rowsBefore + 1);
    await expect(page.locator("tbody")).toContainText("E2E Tester");

    // approval: human-in-the-loop confirm dialog, then status flips
    await page.getByRole("button", { name: "Approve leave", exact: true }).first().click();
    await expect(page.getByText(/Human-in-the-loop check/)).toBeVisible();
    await page.getByRole("button", { name: "Approve", exact: true }).click();
    await expect(page.getByText(/Approve leave approved/)).toBeVisible();
  });

  test("built app: search filters, delete undoes, board drag handles exist", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Leave Tracker/ }).click();
    await expect(page.getByRole("button", { name: /New request/ })).toBeVisible({ timeout: 45_000 });
    const rowsBefore = await page.locator("tbody tr").count();
    expect(rowsBefore).toBeGreaterThanOrEqual(10);

    // search narrows the table
    await page.getByPlaceholder(/Search requests/).fill("zzz-no-match");
    await expect(page.getByText(/No requests match/)).toBeVisible();
    await page.getByPlaceholder(/Search requests/).fill("");

    // delete removes a row, undo brings it back
    await page.getByRole("button", { name: "Delete request row" }).first().click();
    await expect(page.locator("tbody tr")).toHaveCount(rowsBefore - 1);
    await page.getByRole("button", { name: "Undo" }).click();
    await expect(page.locator("tbody tr")).toHaveCount(rowsBefore);

    // board view renders drag-able columns
    await page.getByRole("button", { name: "request · board" }).click();
    await expect(page.getByText(/pending \(/)).toBeVisible();
  });

  test("shareable URL renders the standalone app", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Bug Tracker/ }).click();
    await expect(page.getByRole("link", { name: /Open standalone/ })).toBeVisible({ timeout: 45_000 });
    const href = await page.getByRole("link", { name: /Open standalone/ }).getAttribute("href");
    expect(href).toBeTruthy();

    await page.goto(href!);
    await expect(page.getByRole("heading", { level: 1, name: "Bug Tracker" })).toBeVisible();
    await expect(page.getByText("lives in this URL")).toBeVisible();
    await expect(page.locator("table, .grid").first()).toBeVisible();
  });

  test("malformed bp URL shows friendly error", async ({ page }) => {
    await page.goto("/app?bp=garbage-garbage");
    await expect(page.getByText("No build found in this URL")).toBeVisible();
  });

  test("blueprint API validates input", async ({ request }) => {
    const res = await request.post("/api/blueprint", { data: { prompt: "hi" } });
    expect(res.status()).toBe(400);
  });

  test("dark/light theme toggle persists", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const before = await html.evaluate((el) => el.classList.contains("dark"));
    await page.getByRole("button", { name: /mode/i }).click();
    const after = await html.evaluate((el) => el.classList.contains("dark"));
    expect(after).toBe(!before);
    await page.reload();
    expect(await html.evaluate((el) => el.classList.contains("dark"))).toBe(after);
  });

  test("Q&A page renders all categories", async ({ page }) => {
    await page.goto("/qa");
    await expect(page.getByRole("heading", { name: "Q&A" })).toBeVisible();
    for (const cat of ["The project", "What's AI vs. what's real", "Privacy & data", "Stack & meta"]) {
      await expect(page.getByRole("heading", { name: cat })).toBeVisible();
    }
  });
});
