import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { render } from '@/tests/utils/custom-render';

import App from './App';

describe('App', () => {
  test('renders without crashing', () => {
    render(<App />);

    const heading = screen.getByRole('textbox', { name: /search/i });

    expect(heading).toBeInTheDocument();
  });
});
