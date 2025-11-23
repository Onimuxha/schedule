import { useState } from 'react';
import { useSchedule } from '@/contexts/ScheduleContext';
import { Button } from '@/components/ui/button';
import { Download, Image as ImageIcon, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

export function ExportButtons() {
  const { language } = useSchedule();
  const [isExporting, setIsExporting] = useState(false);

  const labels = {
    en: {
      exportPng: 'Export as PNG',
      exportPdf: 'Export as PDF',
      exporting: 'Exporting...',
      successPng: 'Schedule exported as PNG',
      successPdf: 'Schedule exported as PDF',
      error: 'Export failed',
    },
    kh: {
      exportPng: 'នាំចេញជា PNG',
      exportPdf: 'នាំចេញជា PDF',
      exporting: 'កំពុងនាំចេញ...',
      successPng: 'បាននាំចេញតារាងពេលជា PNG',
      successPdf: 'បាននាំចេញតារាងពេលជា PDF',
      error: 'នាំចេញបរាជ័យ',
    },
  };

  const t = labels[language];

  const exportAsPng = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('schedule-container');
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: '#121212',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `weekly-schedule-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast.success(t.successPng);
    } catch (error) {
      toast.error(t.error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsPdf = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('schedule-container');
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: '#121212',
        scale: 2,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`weekly-schedule-${Date.now()}.pdf`);

      toast.success(t.successPdf);
    } catch (error) {
      toast.error(t.error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="default"
        size="sm"
        onClick={exportAsPng}
        disabled={isExporting}
        className={`bg-indigo-600 hover:bg-indigo-700 text-white ${language === 'kh' ? 'font-khmer' : 'font-outfit'}`}
        data-testid="button-export-png"
      >
        <ImageIcon className="w-4 h-4 mr-2" />
        {isExporting ? t.exporting : t.exportPng}
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={exportAsPdf}
        disabled={isExporting}
        className={`bg-purple-600 hover:bg-purple-700 text-white ${language === 'kh' ? 'font-khmer' : 'font-outfit'}`}
        data-testid="button-export-pdf"
      >
        <FileText className="w-4 h-4 mr-2" />
        {isExporting ? t.exporting : t.exportPdf}
      </Button>
    </div>
  );
}
