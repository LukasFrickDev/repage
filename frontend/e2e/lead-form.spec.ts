import { expect, test, type Page } from '@playwright/test';

const apiPath = '**/api/v1/leads/';

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

async function openContact(page: Page) {
  await page.goto('/#contato');
  await expect(page.locator('#contato')).toBeVisible();
  await expect(page.getByRole('form', { name: 'Solicitar orçamento' })).toBeVisible();
}

async function fillRequiredFields(page: Page) {
  await page.getByLabel('Nome').fill('Ana Souza');
  await page.getByRole('textbox', { name: 'E-mail' }).fill('ana@example.com');
  await page.getByLabel('Telefone').fill('(11) 99999-9999');
  await page.getByRole('combobox', { name: 'Tipo de projeto' }).click();
  await page.getByRole('option', { name: 'Landing page' }).click();
  await page.getByRole('checkbox', { name: /Li e estou ciente/ }).check();
}

test.describe('lead form integration states', () => {
  test('renders, validates with keyboard focus and preserves the first error', async ({ page }) => {
    await openContact(page);

    const form = page.getByRole('form', { name: 'Solicitar orçamento' });
    await form.getByRole('button', { name: 'Solicitar orçamento' }).press('Enter');

    await expect(page.getByLabel('Nome')).toBeFocused();
    await expect(page.getByText('Informe seu nome.')).toBeVisible();
    await expect(page.getByRole('alert').first()).toContainText('Revise os campos destacados');
  });

  test('submits through the real form and exposes loading then 201 success', async ({ page }) => {
    let releaseRequest!: () => void;
    let submittedPayload: Record<string, unknown> | undefined;
    const requestIntercepted = deferred();
    const responseFulfilled = deferred();
    const requestReleased = new Promise<void>((resolve) => { releaseRequest = resolve; });
    await page.route(apiPath, async (route) => {
      submittedPayload = route.request().postDataJSON() as Record<string, unknown>;
      requestIntercepted.resolve();
      await requestReleased;
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'received', message: 'Recebemos sua solicitação.', request_id: 'e2e-request' }),
      });
      responseFulfilled.resolve();
    });
    await openContact(page);
    await fillRequiredFields(page);
    await page.getByLabel('Marca, negócio ou projeto').fill('Negócio fictício');

    await page.getByRole('button', { name: 'Solicitar orçamento' }).click();
    await requestIntercepted.promise;
    await expect(page.getByRole('button', { name: 'Enviando…' })).toBeDisabled();
    await expect(page.getByLabel('Nome')).toHaveValue('Ana Souza');

    releaseRequest();
    await responseFulfilled.promise;
    await expect(page.getByRole('status')).toContainText('Solicitação recebida.');
    await expect(page.getByLabel('Nome')).toHaveValue('');
    expect(submittedPayload).toMatchObject({
      source: 'website',
      privacy_policy_acknowledged: true,
      privacy_policy_version: '2026-08-20-v1',
      whatsapp: '+5511999999999',
    });
  });

  test('maps backend field errors and preserves values without retry', async ({ page }) => {
    let requestCount = 0;
    await page.route(apiPath, async (route) => {
      requestCount += 1;
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: { code: 'validation_error', message: 'Revise os campos informados.', fields: { email: ['Informe um e-mail válido.'] } },
          request_id: 'e2e-request',
        }),
      });
    });
    await openContact(page);
    await fillRequiredFields(page);
    await page.getByRole('button', { name: 'Solicitar orçamento' }).click();

    await expect(page.getByText('Informe um e-mail válido.')).toBeVisible();
    await expect(page.getByLabel('Nome')).toHaveValue('Ana Souza');
    expect(requestCount).toBe(1);
  });

  test('reuses the attempt key after 429 and keeps the honeypot out of focus order', async ({ page }) => {
    const requests: { headers: Record<string, string>; payload: Record<string, unknown> }[] = [];
    const requestIntercepted = [deferred(), deferred()];
    const responseFulfilled = [deferred(), deferred()];
    await page.route(apiPath, async (route) => {
      const requestIndex = requests.length;
      requests.push({
        headers: route.request().headers(),
        payload: route.request().postDataJSON() as Record<string, unknown>,
      });
      requestIntercepted[requestIndex].resolve();
      await route.fulfill({
        status: requests.length === 1 ? 429 : 201,
        contentType: 'application/json',
        body: JSON.stringify(requests.length === 1
          ? { error: { code: 'rate_limited', message: 'Tente novamente mais tarde.' }, request_id: 'e2e-429' }
          : { status: 'received', message: 'Recebemos sua solicitação.', request_id: 'e2e-201' }),
      });
      responseFulfilled[requestIndex].resolve();
    });
    await openContact(page);
    await fillRequiredFields(page);

    const honeypot = page.locator('input[name="company_website"]');
    await expect(honeypot).toHaveCount(1);
    await expect(honeypot).toHaveAttribute('tabindex', '-1');
    await expect(honeypot).toHaveAttribute('aria-hidden', 'true');
    await expect(honeypot).toHaveAttribute('autocomplete', 'off');
    const honeypotStyles = await honeypot.evaluate((element) => {
      const styles = getComputedStyle(element);
      return {
        position: styles.position,
        width: styles.width,
        height: styles.height,
        overflow: styles.overflow,
        clip: styles.clip,
        tabIndex: (element as HTMLInputElement).tabIndex,
      };
    });
    expect(honeypotStyles.position).toBe('absolute');
    expect(honeypotStyles.width).toBe('1px');
    expect(honeypotStyles.height).toBe('1px');
    expect(['hidden', 'clip']).toContain(honeypotStyles.overflow);
    expect(honeypotStyles.clip).toBe('rect(0px, 0px, 0px, 0px)');
    expect(honeypotStyles.tabIndex).toBe(-1);

    await page.getByRole('button', { name: 'Solicitar orçamento' }).click();
    await requestIntercepted[0].promise;
    await responseFulfilled[0].promise;
    await expect(page.getByRole('alert')).toContainText('Tente novamente mais tarde.');
    await expect(page.getByLabel('Nome')).toHaveValue('Ana Souza');
    await page.getByRole('button', { name: 'Solicitar orçamento' }).click();
    await requestIntercepted[1].promise;
    await responseFulfilled[1].promise;
    await expect(page.getByRole('status')).toContainText('Solicitação recebida.');

    expect(requests).toHaveLength(2);
    expect(requests[0].headers['idempotency-key']).toBe(requests[1].headers['idempotency-key']);
    expect(requests[0].payload.form_started_at).toBe(requests[1].payload.form_started_at);
  });

  test('has no horizontal overflow and keeps controls usable under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openContact(page);

    await expect(page.getByRole('heading', { name: 'Solicitar orçamento' })).toBeVisible();
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
    await expect(page.getByLabel('Nome')).toBeEditable();
    await expect(page.getByRole('button', { name: 'Solicitar orçamento' })).toBeVisible();
    const combobox = page.getByRole('combobox', { name: 'Tipo de projeto' });
    await combobox.press('Enter');
    const comboboxBox = await combobox.boundingBox();
    const listbox = page.getByRole('listbox', { name: 'Opções de tipo de projeto' });
    const listboxBox = await listbox.boundingBox();
    expect(comboboxBox).not.toBeNull();
    expect(listboxBox).not.toBeNull();
    expect(listboxBox!.y).toBeGreaterThan(comboboxBox!.y + comboboxBox!.height - 1);
    await combobox.press('ArrowDown');
    await combobox.press('Enter');
    await expect(combobox).toHaveText('Site institucional');
    await combobox.press('Enter');
    await combobox.press('Escape');
    await expect(combobox).toHaveAttribute('aria-expanded', 'false');
    const whatsappLink = page.getByRole('link', { name: 'Falar pelo WhatsApp' });
    await expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/5511958244081?text=Ol%C3%A1!%20Conheci%20a%20Repage%20pelo%20site%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto.');
    await expect(whatsappLink).toHaveAttribute('target', '_blank');
  });
});
