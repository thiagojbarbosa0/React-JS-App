import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the gallery heading', () => {
  render(<App />);
  const heading = screen.getByText(/lumen gallery/i);
  expect(heading).toBeInTheDocument();
});
