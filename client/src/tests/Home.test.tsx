import { screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';

import Home from '@/app/page';
import { render } from '@/tests/utils/custom-render';

test('Pages Router', () => {
  render(<Home />);

  const main = within(screen.getByRole('main'));

  expect(main.getByRole('link', { name: /Deploy Now/i })).toBeInTheDocument();
});
