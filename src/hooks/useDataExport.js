// hooks/useDataExport.js
import { useState, useCallback } from 'react';
import { useAnalytics } from './useAnalytics';

export const useDataExport = (options = {}) => {
  const {
    defaultFormat = 'json',
    enableCSV = true,
    enableJSON = true,
    enableExcel = false,
    trackEvents = true // ✅ إضافة خيار للتحكم في التتبع
  } = options;

  const { trackEvent, trackError } = useAnalytics();
  
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastExport, setLastExport] = useState(null);

  // ✅ تحويل البيانات إلى CSV
  const convertToCSV = useCallback((data, headers = null) => {
    try {
      if (!data || !Array.isArray(data)) {
        throw new Error('بيانات غير صالحة للتحويل');
      }

      const actualHeaders = headers || Object.keys(data[0] || {});
      const csvHeaders = actualHeaders.join(',');
      
      const csvRows = data.map(row => {
        return actualHeaders.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
          return String(value);
        }).join(',');
      });

      return [csvHeaders, ...csvRows].join('\n');
    } catch (error) {
      // ✅ دائماً تتبع الأخطاء
      trackError('csv_conversion_failed', error.message, 'useDataExport', { 
        data_length: data?.length,
        tracking_source: 'useDataExport'
      });
      throw error;
    }
  }, [trackError]);

  // ✅ تحويل البيانات إلى Excel
  const convertToExcel = useCallback(async (data, sheetName = 'Data') => {
    if (trackEvents) {
      trackEvent('excel_export_attempt', { 
        data_points: data?.length,
        tracking_source: 'useDataExport'
      });
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`EXCEL_DATA_FOR_${sheetName}_${Date.now()}`);
      }, 1000);
    });
  }, [trackEvent, trackEvents]);

  // ✅ تصدير البيانات
  const exportData = useCallback(async (data, exportOptions = {}) => {
    const {
      format = defaultFormat,
      filename = `export-${new Date().toISOString().split('T')[0]}`,
      dataType = 'general',
      includeMetadata = true
    } = exportOptions;

    setExporting(true);
    setProgress(0);

    try {
      // ✅ التتبع الشرطي
      if (trackEvents) {
        trackEvent('export_started', { 
          format, 
          dataType, 
          data_points: data?.length,
          tracking_source: 'useDataExport'
        });
      }

      let exportContent;
      let mimeType;
      let fileExtension;

      setProgress(30);

      switch (format.toLowerCase()) {
        case 'csv':
          if (!enableCSV) throw new Error('تصدير CSV غير مفعل');
          exportContent = convertToCSV(data);
          mimeType = 'text/csv';
          fileExtension = 'csv';
          break;

        case 'json':
          if (!enableJSON) throw new Error('تصدير JSON غير مفعل');
          exportContent = JSON.stringify({
            metadata: includeMetadata ? {
              exported_at: new Date().toISOString(),
              data_type: dataType,
              records_count: data?.length,
              version: '1.0',
              tracking_source: 'useDataExport' // ✅ إضافة مصدر التتبع
            } : {},
            data
          }, null, 2);
          mimeType = 'application/json';
          fileExtension = 'json';
          break;

        default:
          throw new Error(`صيغة غير مدعومة: ${format}`);
      }

      setProgress(80);

      // إنشاء وتنزيل الملف
      const blob = new Blob([exportContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProgress(100);
      setLastExport({
        timestamp: new Date(),
        format,
        dataType,
        filename: `${filename}.${fileExtension}`,
        recordsCount: data?.length
      });

      // ✅ التتبع الشرطي للنجاح
      if (trackEvents) {
        trackEvent('export_success', {
          format,
          dataType,
          records_count: data?.length,
          file_size: blob.size,
          tracking_source: 'useDataExport'
        });
      }

      return {
        success: true,
        filename: `${filename}.${fileExtension}`,
        size: blob.size,
        format
      };

    } catch (error) {
      console.error('Export failed:', error);
      // ✅ دائماً تتبع الأخطاء
      trackError('export_failed', error.message, 'useDataExport', {
        format,
        dataType,
        data_points: data?.length,
        tracking_source: 'useDataExport'
      });

      return {
        success: false,
        error: error.message
      };
    } finally {
      setExporting(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [defaultFormat, enableCSV, enableJSON, enableExcel, convertToCSV, convertToExcel, trackEvent, trackError, trackEvents]);

  // ✅ الباقي بدون تغيير...
  const exportMultipleFormats = useCallback(async (data, formats = ['json', 'csv'], options = {}) => {
    const results = [];
    
    for (const format of formats) {
      const result = await exportData(data, { ...options, format });
      results.push(result);
    }

    if (trackEvents) {
      trackEvent('multiple_export_completed', {
        formats: formats.join(','),
        total_records: data?.length,
        successful_exports: results.filter(r => r.success).length,
        tracking_source: 'useDataExport'
      });
    }

    return results;
  }, [exportData, trackEvent, trackEvents]);

  return {
    exporting,
    progress,
    lastExport,
    exportData,
    exportMultipleFormats,
    convertToCSV,
    convertToExcel,
    getExportStats: () => ({
      lastExport,
      totalExports: lastExport ? 1 : 0,
      supportedFormats: { csv: enableCSV, json: enableJSON, excel: enableExcel }
    })
  };
};

export default useDataExport;