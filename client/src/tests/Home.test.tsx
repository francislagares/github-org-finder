import { screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';

import Home from '@/app/page';
import { render } from '@/tests/utils/custom-render';

test('Pages Router', async () => {
  render(<Home />);

  const main = waitFor(() => screen.getByRole('main'));
  screen.debug(main);

  expect(main).toBeInTheDocument();
});
