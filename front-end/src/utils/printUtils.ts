import { toast } from 'react-toastify';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';

interface PrintOptions {
  template: any;
  printRef: React.RefObject<HTMLDivElement>;
  pageSizes: {
    [key: string]: { width: number; height: number };
  };
}

export const handlePrint = async ({ template, printRef, pageSizes }: PrintOptions) => {
  if (printRef.current) {
    try {
      toast.info('Preparing document...');
      
      const pageSize = template?.pageSize || 'A4';
      const { width: pageWidth, height: pageHeight } = pageSizes[pageSize];
      
      const originalStyle = printRef.current.style.cssText;
      Object.assign(printRef.current.style, {
        width: `${pageWidth}px`,
        height: `${pageHeight}px`,
        position: 'absolute',
        left: '0',
        top: '0',
        transform: 'none',
        transformOrigin: 'top left'
      });

      const dataUrl = await domtoimage.toPng(printRef.current, {
        quality: 1.0,
        width: pageWidth,
        height: pageHeight,
        style: {
          '-webkit-print-color-adjust': 'exact',
          'print-color-adjust': 'exact'
        },
        cacheBust: true
      });
      
      printRef.current.style.cssText = originalStyle;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${template?.name || 'Form Preview'}</title>
              <style>
                @page {
                  size: ${pageSize};
                  margin: 0;
                }
                body {
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: flex-start;
                  background-color: white;
                }
                img {
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                  display: block;
                  margin: 0;
                  padding: 0;
                }
              </style>
            </head>
            <body>
              <img 
                src="${dataUrl}" 
                alt="Form Preview"
                style="vertical-align: top; display: block;"
              />
              <script>
                window.onload = () => {
                  const img = document.querySelector('img');
                  if (img) {
                    img.onload = () => {
                      setTimeout(() => {
                        window.print();
                        window.close();
                      }, 250);
                    };
                  }
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
        toast.success('Document printed successfully!');
      } else {
        throw new Error('Could not open print window');
      }
    } catch (error) {
      console.error('Print failed:', error);
      toast.error('Failed to print document');
    }
  }
};

export const handleDownloadPDF = async ({ template, printRef, pageSizes }: PrintOptions) => {
  if (printRef.current) {
    try {
      toast.info('Preparing PDF...');
      
      const pageSize = template?.pageSize || 'A4';
      const { width: pageWidth, height: pageHeight } = pageSizes[pageSize];
      
      const originalStyle = printRef.current.style.cssText;
      Object.assign(printRef.current.style, {
        width: `${pageWidth}px`,
        height: `${pageHeight}px`,
        position: 'absolute',
        left: '0',
        top: '0',
        transform: 'none',
        transformOrigin: 'top left'
      });

      const dataUrl = await domtoimage.toPng(printRef.current, {
        quality: 1.0,
        width: pageWidth,
        height: pageHeight,
        style: {
          '-webkit-print-color-adjust': 'exact',
          'print-color-adjust': 'exact'
        },
        cacheBust: true
      });
      
      printRef.current.style.cssText = originalStyle;

      // Convert pixels to millimeters for A4 size
      const mmWidth = 210; // A4 width in mm
      const mmHeight = 297; // A4 height in mm

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      pdf.addImage(
        dataUrl,
        'PNG',
        0,
        0,
        mmWidth,
        mmHeight,
        undefined,
        'FAST'
      );

      pdf.save(`${template?.name || 'form'}.pdf`);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to generate PDF');
    }
  }
}; 