import React, { useMemo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { VegaLite } from 'react-vega';
import { ChartNode } from '../app/dfSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

interface ChartViewerProps {
  node: ChartNode;
}

export const ChartViewer: React.FC<ChartViewerProps> = ({ node }) => {
  const tables = useSelector((state: RootState) => state.root.tables);
  
  const vegaSpec = useMemo(() => {
    if (node.vegaLiteSpec) {
      return node.vegaLiteSpec;
    }

    // Generate basic Vega-Lite spec from encodings
    const data = node.transformedData || (node.tableIds.length > 0 ? 
      tables.find(t => t.id === node.tableIds[0])?.data : []);

    if (!data || data.length === 0) {
      return null;
    }

    const spec: any = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { values: data },
      mark: node.chartType,
      encoding: {},
      width: 400,
      height: 300,
    };

    if (node.encodings.x) {
      spec.encoding.x = { field: node.encodings.x, type: 'nominal' };
    }
    if (node.encodings.y) {
      spec.encoding.y = { field: node.encodings.y, type: 'quantitative' };
    }
    if (node.encodings.color) {
      spec.encoding.color = { field: node.encodings.color, type: 'nominal' };
    }
    if (node.encodings.size) {
      spec.encoding.size = { field: node.encodings.size, type: 'quantitative' };
    }

    return spec;
  }, [node, tables]);

  if (!vegaSpec) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Configure encodings and click "Formulate" to generate a chart
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <VegaLite spec={vegaSpec} actions={false} />
      {node.code && (
        <Paper sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Generated Code:</Typography>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {node.code}
          </pre>
        </Paper>
      )}
    </Box>
  );
};