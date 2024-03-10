import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProtectedTest from './ProtectedTest';

describe('<ProtectedTest />', () => {
  test('it should mount', () => {
    render(<ProtectedTest />);
    
    const protectedTest = screen.getByTestId('ProtectedTest');

    expect(protectedTest).toBeInTheDocument();
  });
});