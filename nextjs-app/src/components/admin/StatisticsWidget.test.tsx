/**
 * Tests for StatisticsWidget component
 * 
 * Tests the statistics widget display including:
 * - Rendering with data
 * - Loading state
 * - Icon and label display
 * - Value formatting
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatisticsWidget } from './StatisticsWidget';

describe('StatisticsWidget', () => {
  it('should render with label and value', () => {
    render(
      <StatisticsWidget
        label="Total Projects"
        value={5}
        icon="💼"
        isLoading={false}
      />
    );

    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('💼')).toBeInTheDocument();
  });

  it('should display loading skeleton when isLoading is true', () => {
    const { container } = render(
      <StatisticsWidget
        label="Total Projects"
        value={5}
        icon="💼"
        isLoading={true}
      />
    );

    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.queryByText('5')).not.toBeInTheDocument();

    // Check for loading skeleton
    const skeleton = container.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('should render with zero value', () => {
    render(
      <StatisticsWidget
        label="Total Achievements"
        value={0}
        icon="🏆"
        isLoading={false}
      />
    );

    expect(screen.getByText('Total Achievements')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should render with large numbers', () => {
    render(
      <StatisticsWidget
        label="Tech Stack Items"
        value={999}
        icon="⚙️"
        isLoading={false}
      />
    );

    expect(screen.getByText('Tech Stack Items')).toBeInTheDocument();
    expect(screen.getByText('999')).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    const { container } = render(
      <StatisticsWidget
        label="Total Projects"
        value={5}
        icon="💼"
        isLoading={false}
      />
    );

    const widget = container.firstChild;
    expect(widget).toHaveClass('p-6');
    expect(widget).toHaveClass('bg-[var(--surface)]');
    expect(widget).toHaveClass('border');
    expect(widget).toHaveClass('rounded-lg');
  });

  it('should render icon with correct opacity', () => {
    const { container } = render(
      <StatisticsWidget
        label="Total Projects"
        value={5}
        icon="💼"
        isLoading={false}
      />
    );

    const icon = container.querySelector('.opacity-20');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent('💼');
  });

  it('should apply default isLoading value', () => {
    const { container } = render(
      <StatisticsWidget
        label="Total Projects"
        value={5}
        icon="💼"
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument();
  });
});
