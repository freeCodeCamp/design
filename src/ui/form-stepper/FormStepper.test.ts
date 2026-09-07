import { strict as assert } from 'node:assert';
import { test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { FormStepper, type FormStepperStep } from './FormStepper.tsx';

const STEPS = [
  { id: 'intro', label: 'Intro' },
  { id: 'details', label: 'Details', description: 'Enter your info' },
  { id: 'confirm', label: 'Confirm' }
];

test('FormStepper renders the progress list with three steps', () => {
  const html = renderToStaticMarkup(
    createElement(FormStepper, {
      steps: STEPS,
      current: 'intro',
      onStepChange: () => {},
      children: () => createElement('p', null, 'body')
    })
  );
  assert.match(html, /class="form-stepper"/);
  assert.match(html, /class="form-stepper__progress"/);
  const stepMatches = html.match(/class="form-stepper__step"/g) ?? [];
  assert.equal(stepMatches.length, 3);
});

test('FormStepper marks before-current as complete and current with aria-current=step', () => {
  const html = renderToStaticMarkup(
    createElement(FormStepper, {
      steps: STEPS,
      current: 'details',
      onStepChange: () => {},
      children: () => null
    })
  );
  assert.match(html, /data-state="complete"/);
  assert.match(html, /data-state="current"/);
  assert.match(html, /data-state="upcoming"/);
  assert.match(html, /aria-current="step"/);
});

test('FormStepper renders step index + label + optional description', () => {
  const html = renderToStaticMarkup(
    createElement(FormStepper, {
      steps: STEPS,
      current: 'details',
      onStepChange: () => {},
      children: () => null
    })
  );
  assert.match(html, /class="form-stepper__step-index"[^>]*>1</);
  assert.match(html, /class="form-stepper__step-index"[^>]*>2</);
  assert.match(html, /class="form-stepper__step-label">Intro</);
  assert.match(html, /class="form-stepper__step-description">Enter your info</);
});

test('FormStepper upcoming steps disable the trigger', () => {
  const html = renderToStaticMarkup(
    createElement(FormStepper, {
      steps: STEPS,
      current: 'intro',
      onStepChange: () => {},
      children: () => null
    })
  );
  // Two upcoming steps (details + confirm) → two disabled buttons.
  const disabledMatches = html.match(/<button[^>]*disabled/g) ?? [];
  assert.equal(disabledMatches.length, 2);
});

test('FormStepper passes the resolved step object to the render prop', () => {
  let received: unknown = null;
  renderToStaticMarkup(
    createElement(FormStepper, {
      steps: STEPS,
      current: 'confirm',
      onStepChange: () => {},
      children: (step: FormStepperStep) => {
        received = step;
        return null;
      }
    })
  );
  assert.deepEqual(received, { id: 'confirm', label: 'Confirm' });
});

test('FormStepper falls back to the first step when current does not match', () => {
  const html = renderToStaticMarkup(
    createElement(FormStepper, {
      steps: STEPS,
      current: 'nope',
      onStepChange: () => {},
      children: (step: FormStepperStep) =>
        createElement('p', { 'data-step': step.id })
    })
  );
  assert.match(html, /data-step="intro"/);
});
