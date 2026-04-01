import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppHeader } from './AppHeader';

vi.mock('./logo.svg', () => ({
  default: '/mocked-logo.svg',
}));

describe('AppHeader', () => {
  const givenChildren = <div data-testid="test-child">Test Child Content</div>;

  beforeEach(() => {
    // Clear any previous renders
    vi.clearAllMocks();
  });

  describe('Logo and branding', () => {
    it('renders the logo image with correct dimensions', () => {
      render(<AppHeader />);

      const logo = screen.getByRole('img', { name: /logo/i });

      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/mocked-logo.svg');
      expect(logo).toHaveAttribute('width', '32');
      expect(logo).toHaveAttribute('height', '32');
    });

    it('renders GitHub link with correct href', () => {
      render(<AppHeader />);

      const githubLink = screen.getByRole('link');

      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute('href', 'https://github.com/falkosch/tic-tac-toe-azure');
    });

    it('renders "TicTacToe" text with three colored spans', () => {
      render(<AppHeader />);

      const ticText = screen.getByText('Tic');
      const tacText = screen.getByText('Tac');
      const toeText = screen.getByText('Toe');

      expect(ticText).toBeInTheDocument();
      expect(ticText).toHaveClass('text-green-700');

      expect(tacText).toBeInTheDocument();
      expect(tacText).toHaveClass('text-blue-700');

      expect(toeText).toBeInTheDocument();
      expect(toeText).toHaveClass('text-red-700');
    });
  });

  describe('Desktop navigation', () => {
    it('renders children in desktop navigation menu', () => {
      render(<AppHeader>{givenChildren}</AppHeader>);

      const desktopMenu = screen.getAllByTestId('test-child')[0];

      expect(desktopMenu).toBeInTheDocument();
    });

    it('renders children in a container with hidden class on mobile', () => {
      const { container } = render(<AppHeader>{givenChildren}</AppHeader>);

      const desktopMenuContainer = container.querySelector('.hidden.items-center.gap-3.md\\:flex');

      expect(desktopMenuContainer).toBeInTheDocument();
    });
  });

  describe('Mobile menu toggle button', () => {
    it('renders mobile menu toggle button', () => {
      render(<AppHeader />);

      const menuButton = screen.getByRole('button', { name: /open main menu/i });

      expect(menuButton).toBeInTheDocument();
    });

    it('renders button with correct accessibility attributes initially', () => {
      render(<AppHeader />);

      const menuButton = screen.getByRole('button', { name: /open main menu/i });

      expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu');
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('renders hamburger icon when menu is closed', () => {
      render(<AppHeader />);

      const menuButton = screen.getByRole('button', { name: /open main menu/i });
      const svg = menuButton.querySelector('svg');
      const path = svg?.querySelector('path');

      expect(path).toHaveAttribute('d', 'M4 6h16M4 12h16M4 18h16');
    });

    it('toggles menu open when button is clicked', () => {
      const { container } = render(<AppHeader />);

      const menuButton = screen.getByRole('button', { name: /open main menu/i });

      fireEvent.click(menuButton);

      const mobileMenu = container.querySelector('.block.fixed');

      expect(mobileMenu).toBeInTheDocument();
    });

    it('renders X icon when menu is open', () => {
      render(<AppHeader />);

      const menuButton = screen.getByRole('button', { name: /open main menu/i });

      fireEvent.click(menuButton);

      const svg = menuButton.querySelector('svg');
      const path = svg?.querySelector('path');

      expect(path).toHaveAttribute('d', 'M6 18L18 6M6 6l12 12');
    });

    it('toggles menu closed when button is clicked again', () => {
      const { container } = render(<AppHeader />);

      const menuButton = screen.getByRole('button', { name: /open main menu/i });

      fireEvent.click(menuButton);
      fireEvent.click(menuButton);

      const mobileMenu = container.querySelector('.block.fixed');

      expect(mobileMenu).not.toBeInTheDocument();
    });

    it('multiple clicks toggle menu state correctly', () => {
      const { container } = render(<AppHeader />);

      const menuButton = screen.getByRole('button', { name: /open main menu/i });
      const getMobileMenuElement = () =>
        container.querySelector('.fixed.top-14.right-0.left-1\\/4');

      // Initially hidden
      expect(getMobileMenuElement()).toHaveClass('hidden');

      // Open
      fireEvent.click(menuButton);
      expect(getMobileMenuElement()).toHaveClass('block');

      // Close
      fireEvent.click(menuButton);
      expect(getMobileMenuElement()).toHaveClass('hidden');

      // Open again
      fireEvent.click(menuButton);
      expect(getMobileMenuElement()).toHaveClass('block');
    });
  });

  describe('Mobile menu', () => {
    it('hides mobile menu by default', () => {
      const { container } = render(<AppHeader>{givenChildren}</AppHeader>);

      const mobileMenu = container.querySelector('.hidden.fixed');

      expect(mobileMenu).toBeInTheDocument();
    });

    it('shows mobile menu when toggle button is clicked', () => {
      render(<AppHeader>{givenChildren}</AppHeader>);

      const menuButton = screen.getByRole('button', { name: /open main menu/i });

      fireEvent.click(menuButton);

      const mobileMenuChild = screen.getAllByTestId('test-child')[1];

      expect(mobileMenuChild).toBeInTheDocument();
    });

    it('renders children in mobile menu when open', () => {
      render(<AppHeader>{givenChildren}</AppHeader>);

      const menuButton = screen.getByRole('button', { name: /open main menu/i });

      fireEvent.click(menuButton);

      const childrenInMobileMenu = screen.getAllByTestId('test-child');

      expect(childrenInMobileMenu).toHaveLength(2); // One in desktop menu, one in mobile menu
    });

    it('applies correct positioning classes to mobile menu', () => {
      const { container } = render(<AppHeader />);

      const menuButton = screen.getByRole('button', { name: /open main menu/i });

      fireEvent.click(menuButton);

      const mobileMenu = container.querySelector(
        '.block.fixed.top-14.right-0.left-1\\/4.flex.flex-col',
      );

      expect(mobileMenu).toBeInTheDocument();
    });
  });

  describe('Rendering without children', () => {
    it('renders correctly when no children are provided', () => {
      render(<AppHeader />);

      const logo = screen.getByRole('img', { name: /logo/i });
      const menuButton = screen.getByRole('button', { name: /open main menu/i });

      expect(logo).toBeInTheDocument();
      expect(menuButton).toBeInTheDocument();
    });

    it('renders empty desktop navigation menu when no children provided', () => {
      const { container } = render(<AppHeader />);

      const desktopMenu = container.querySelector('.hidden.items-center.gap-3.md\\:flex');

      expect(desktopMenu).toBeInTheDocument();
      expect(desktopMenu?.children).toHaveLength(0);
    });

    it('renders empty mobile menu when no children provided', () => {
      const { container } = render(<AppHeader />);

      const menuButton = screen.getByRole('button', { name: /open main menu/i });

      fireEvent.click(menuButton);

      const mobileMenu = container.querySelector('.block.fixed');

      expect(mobileMenu).toBeInTheDocument();
      expect(mobileMenu?.children).toHaveLength(0);
    });
  });

  describe('Responsive behavior', () => {
    it('applies responsive classes for mobile/desktop layout', () => {
      const { container } = render(<AppHeader />);

      const header = container.querySelector('header');

      expect(header).toHaveClass('flex', 'justify-between', 'md:justify-start');
    });

    it('hides menu button on desktop screens with md:hidden class', () => {
      render(<AppHeader />);

      const menuButton = screen.getByRole('button', { name: /open main menu/i });

      expect(menuButton).toHaveClass('md:hidden');
    });

    it('hides desktop menu on mobile with hidden class', () => {
      const { container } = render(<AppHeader />);

      const desktopMenu = container.querySelector('.hidden.md\\:flex');

      expect(desktopMenu).toBeInTheDocument();
    });

    it('hides mobile menu on desktop with md:hidden class', () => {
      const { container } = render(<AppHeader />);

      const menuButton = screen.getByRole('button', { name: /open main menu/i });

      fireEvent.click(menuButton);

      const mobileMenu = container.querySelector('.md\\:hidden.fixed');

      expect(mobileMenu).toBeInTheDocument();
    });
  });
});
