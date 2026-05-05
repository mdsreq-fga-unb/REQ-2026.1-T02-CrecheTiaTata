import { render, screen } from '@testing-library/react';
import { Feature } from './index';

test('renders feature component', () => {
  render(<Feature title="Test" description="Desc" Svg={() => <svg />} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});