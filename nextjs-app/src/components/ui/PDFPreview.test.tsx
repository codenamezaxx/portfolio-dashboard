/**
 * Tests for PDFPreview Component
 * 
 * Tests cover:
 * - PDF loading and rendering
 * - Page navigation (previous/next)
 * - Page information display
 * - Download functionality
 * - Error handling
 * - Loading states
 * - Accessibility features
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PDFPreview } from './PDFPreview';
import * as pdfjsLib from 'pdfjs-dist';

// Mock PDF.js
jest.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: {
    workerSrc: '',
  },
  getDocument: jest.fn(),
  version: '3.0.0',
}));

// Mock fetch
global.fetch = jest.fn();

describe('PDFPreview Component', () => {
  const mockPdfUrl = 'https://example.com/document.pdf';
  const mockFilename = 'test-document.pdf';

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('Rendering', () => {
    it('should render loading state initially', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
              });
            }, 100);
          })
      );

      (pdfjsLib.getDocument as jest.Mock).mockReturnValue({
        promise: new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              numPages: 5,
              getPage: jest.fn().mockResolvedValue({
                getViewport: jest.fn().mockReturnValue({
                  width: 600,
                  height: 800,
                }),
                render: jest.fn().mockReturnValue({
                  promise: Promise.resolve(),
                }),
              }),
            });
          }, 100);
        }),
      });

      render(<PDFPreview url={mockPdfUrl} filename={mockFilename} />);

      expect(screen.getByText(/Loading PDF/i)).toBeInTheDocument();
    });

    it('should render canvas element', async () => {
      const mockPdf = {
        numPages: 5,
        getPage: jest.fn().mockResolvedValue({
          getViewport: jest.fn().mockReturnValue({
            width: 600,
            height: 800,
          }),
          render: jest.fn().mockReturnValue({
            promise: Promise.resolve(),
          }),
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      });

      (pdfjsLib.getDocument as jest.Mock).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      render(<PDFPreview url={mockPdfUrl} filename={mockFilename} />);

      await waitFor(() => {
        const canvas = screen.getByRole('img', { hidden: true });
        expect(canvas).toBeInTheDocument();
      });
    });

    it('should display filename', async () => {
      const mockPdf = {
        numPages: 5,
        getPage: jest.fn().mockResolvedValue({
          getViewport: jest.fn().mockReturnValue({
            width: 600,
            height: 800,
          }),
          render: jest.fn().mockReturnValue({
            promise: Promise.resolve(),
          }),
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      });

      (pdfjsLib.getDocument as jest.Mock).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      render(<PDFPreview url={mockPdfUrl} filename={mockFilename} />);

      await waitFor(() => {
        expect(screen.getByText(`File: ${mockFilename}`)).toBeInTheDocument();
      });
    });
  });

  describe('Page Navigation', () => {
    it('should display page information', async () => {
      const mockPdf = {
        numPages: 5,
        getPage: jest.fn().mockResolvedValue({
          getViewport: jest.fn().mockReturnValue({
            width: 600,
            height: 800,
          }),
          render: jest.fn().mockReturnValue({
            promise: Promise.resolve(),
          }),
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      });

      (pdfjsLib.getDocument as jest.Mock).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      render(<PDFPreview url={mockPdfUrl} filename={mockFilename} showPageInfo={true} />);

      await waitFor(() => {
        expect(screen.getByText(/Page 1 of 5/i)).toBeInTheDocument();
      });
    });

    it('should disable previous button on first page', async () => {
      const mockPdf = {
        numPages: 5,
        getPage: jest.fn().mockResolvedValue({
          getViewport: jest.fn().mockReturnValue({
            width: 600,
            height: 800,
          }),
          render: jest.fn().mockReturnValue({
            promise: Promise.resolve(),
          }),
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      });

      (pdfjsLib.getDocument as jest.Mock).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      render(<PDFPreview url={mockPdfUrl} filename={mockFilename} />);

      await waitFor(() => {
        const previousButton = screen.getByLabelText('Previous page');
        expect(previousButton).toBeDisabled();
      });
    });

    it('should disable next button on last page', async () => {
      const mockPdf = {
        numPages: 1,
        getPage: jest.fn().mockResolvedValue({
          getViewport: jest.fn().mockReturnValue({
            width: 600,
            height: 800,
          }),
          render: jest.fn().mockReturnValue({
            promise: Promise.resolve(),
          }),
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      });

      (pdfjsLib.getDocument as jest.Mock).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      render(<PDFPreview url={mockPdfUrl} filename={mockFilename} />);

      await waitFor(() => {
        const nextButton = screen.getByLabelText('Next page');
        expect(nextButton).toBeDisabled();
      });
    });

    it('should enable next button when not on last page', async () => {
      const mockPdf = {
        numPages: 5,
        getPage: jest.fn().mockResolvedValue({
          getViewport: jest.fn().mockReturnValue({
            width: 600,
            height: 800,
          }),
          render: jest.fn().mockReturnValue({
            promise: Promise.resolve(),
          }),
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      });

      (pdfjsLib.getDocument as jest.Mock).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      render(<PDFPreview url={mockPdfUrl} filename={mockFilename} />);

      await waitFor(() => {
        const nextButton = screen.getByLabelText('Next page');
        expect(nextButton).not.toBeDisabled();
      });
    });

    it('should navigate to next page when next button is clicked', async () => {
      const mockGetPage = jest.fn().mockResolvedValue({
        getViewport: jest.fn().mockReturnValue({
          width: 600,
          height: 800,
        }),
        render: jest.fn().mockReturnValue({
          promise: Promise.resolve(),
        }),
      });

      const mockPdf = {
        numPages: 5,
        getPage: mockGetPage,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      });

      (pdfjsLib.getDocument as jest.Mock).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      render(<PDFPreview url={mockPdfUrl} filename={mockFilename} />);

      await waitFor(() => {
        const nextButton = screen.getByLabelText('Next page');
        fireEvent.click(nextButton);
      });

      await waitFor(() => {
        expect(mockGetPage).toHaveBeenCalledWith(2);
      });
    });

    it('should navigate to previous page when previous button is clicked', async () => {
      const mockGetPage = jest.fn().mockResolvedValue({
        getViewport: jest.fn().mockReturnValue({
          width: 600,
          height: 800,
        }),
        render: jest.fn().mockReturnValue({
          promise: Promise.resolve(),
        }),
      });

      const mockPdf = {
        numPages: 5,
        getPage: mockGetPage,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      });

      (pdfjsLib.getDocument as jest.Mock).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      render(<PDFPreview url={mockPdfUrl} filename={mockFilename} />);

      // First navigate to page 2
      await waitFor(() => {
        const nextButton = screen.getByLabelText('Next page');
        fireEvent.click(nextButton);
      });

      // Then navigate back to page 1
      await waitFor(() => {
        const previousButton = screen.getByLabelText('Previous page');
        fireEvent.click(previousButton);
      });

      await waitFor(() => {
        expect(mockGetPage).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('Download Functionality', () => {
    it('should display download button', async () => {
      const mockPdf = {
        numPages: 5,
        getPage: jest.fn().mockResolvedValue({
          getViewport: jest.fn().mockReturnValue({
            width: 600,
            height: 800,
          }),
          render: jest.fn().mockReturnValue({
            promise: Promise.resolve(),
          }),
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      });

      (pdfjsLib.getDocument as jest.Mock).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      render(<PDFPreview url={mockPdfUrl} filename={mockFilename} showDownload={true} />);

      await waitFor(() => {
        expect(screen.getByLabelText(`Download ${mockFilename}`)).toBeInTheDocument();
      });
    });

    it('should hide download button when showDownload is false', async () => {
      const mockPdf = {
        numPages: 5,
        getPage: jest.fn().mockResolvedValue({
          getViewport: jest.fn().mockReturnValue({
            width: 600,
            height: 800,
          }),
          render: jest.fn().mockReturnValue({
            promise: Promise.resolve(),
          }),
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      });

      (pdfjsLib.getDocument as jest.Mock).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      render(<PDFPreview url={mockPdfUrl} filename={mockFilename} showDownload={false} />);

      await waitFor(() => {
        expect(screen.queryByText(/Download/i)).not.toBeInTheDocument();
      });
    });

    it('should trigger download when download button is clicked', async () => {
      const mockPdf = {
        numPages: 5,
        getPage: jest.fn().mockResolvedValue({
          getViewport: jest.fn().mockReturnValue({
            width: 600,
            height: 800,
          }),
          render: jest.fn().mockReturnValue({
            promise: Promise.resolve(),
          }),
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      });

      (pdfjsLib.getDocument as jest.Mock).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      // Mock document methods
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      };
      const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      const appendChildSpy = jest.spyOn(document, 'appendChild').mockReturnValue(mockLink as any);
      const removeChildSpy = jest.spyOn(document, 'removeChild').mockReturnValue(mockLink as any);

      render(<PDFPreview url={mockPdfUrl} filename={mockFilename} showDownload={true} />);

      await waitFor(() => {
        const downloadButton = screen.getByLabelText(`Download ${mockFilename}`);
        fireEvent.click(downloadButton);
      });

      expect(mockLink.click).toHaveBeenCalled();

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should display error when PDF fetch fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      render(<PDFPreview url={mockPdfUrl} filename={mockFilename} />);

      await waitFor(() => {
        expect(screen.getByText(/Error loading PDF/i)).toBeInTheDocument();
      });
    });

    it('should display error when PDF response is not ok', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      });

      render(<PDFPreview url={mockPdfUrl} filename={mockFilename} />);

      await waitFor(() => {
        expect(screen.getByText(/Error loading PDF/i)).toBeInTheDocument();
      });
    });

    it('should display error when PDF parsing fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      });

      (pdfjsLib.getDocument as jest.Mock).mockReturnValue({
        promise: Promise.reject(new Error('Invalid PDF')),
      });

      render(<PDFPreview url={mockPdfUrl} filename={mockFilename} />);

      await waitFor(() => {
        expect(screen.getByText(/Error loading PDF/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels on navigation buttons', async () => {
      const mockPdf = {
        numPages: 5,
        getPage: jest.fn().mockResolvedValue({
          getViewport: jest.fn().mockReturnValue({
            width: 600,
            height: 800,
          }),
          render: jest.fn().mockReturnValue({
            promise: Promise.resolve(),
          }),
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      });

      (pdfjsLib.getDocument as jest.Mock).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      render(<PDFPreview url={mockPdfUrl} filename={mockFilename} />);

      await waitFor(() => {
        expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
        expect(screen.getByLabelText('Next page')).toBeInTheDocument();
      });
    });

    it('should have proper ARIA label on canvas', async () => {
      const mockPdf = {
        numPages: 5,
        getPage: jest.fn().mockResolvedValue({
          getViewport: jest.fn().mockReturnValue({
            width: 600,
            height: 800,
          }),
          render: jest.fn().mockReturnValue({
            promise: Promise.resolve(),
          }),
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      });

      (pdfjsLib.getDocument as jest.Mock).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      render(<PDFPreview url={mockPdfUrl} filename={mockFilename} />);

      await waitFor(() => {
        const canvas = screen.getByRole('img', { hidden: true });
        expect(canvas).toHaveAttribute('aria-label', 'PDF page 1 of 5');
      });
    });
  });

  describe('Props', () => {
    it('should accept custom maxHeight', async () => {
      const mockPdf = {
        numPages: 5,
        getPage: jest.fn().mockResolvedValue({
          getViewport: jest.fn().mockReturnValue({
            width: 600,
            height: 800,
          }),
          render: jest.fn().mockReturnValue({
            promise: Promise.resolve(),
          }),
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      });

      (pdfjsLib.getDocument as jest.Mock).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      const { container } = render(
        <PDFPreview url={mockPdfUrl} filename={mockFilename} maxHeight="800px" />
      );

      await waitFor(() => {
        const previewContainer = container.querySelector('[style*="max-height"]');
        expect(previewContainer).toHaveStyle('max-height: 800px');
      });
    });

    it('should hide page info when showPageInfo is false', async () => {
      const mockPdf = {
        numPages: 5,
        getPage: jest.fn().mockResolvedValue({
          getViewport: jest.fn().mockReturnValue({
            width: 600,
            height: 800,
          }),
          render: jest.fn().mockReturnValue({
            promise: Promise.resolve(),
          }),
        }),
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      });

      (pdfjsLib.getDocument as jest.Mock).mockReturnValue({
        promise: Promise.resolve(mockPdf),
      });

      render(<PDFPreview url={mockPdfUrl} filename={mockFilename} showPageInfo={false} />);

      await waitFor(() => {
        expect(screen.queryByText(/Page 1 of 5/i)).not.toBeInTheDocument();
      });
    });
  });
});
