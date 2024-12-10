import { screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';

import App from '@/App';
import { render } from '@/tests/utils/custom-render';

test('Pages Router', async () => {
  render(<App />);

  const main = waitFor(() => screen.getByRole('main'));
  screen.debug(main);

  expect(main).toBeInTheDocument();
});
