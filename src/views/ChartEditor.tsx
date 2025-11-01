import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { RootState } from '../app/store';
import { dfActions, ChartNode } from '../app/dfSlice';
import { FieldDropZone } from '../components/FieldDropZone';

interface ChartEditorProps {
  node: ChartNode;
}

export const ChartEditor: React.FC<ChartEditorProps> = ({ node }) => {
  const dispatch = useDispatch();
  const tables = useSelector((state: RootState) => state.root.tables);
  const selectedTables = tables.filter(t => node.tableIds.includes(t.id));

  const allColumns = selectedTables.flatMap(t => 
    t.columns.map(col => ({ table: t.name, column: col, full: `${t.name}.${col}` }))
  );

  const handleChartTypeChange = (chartType: any) => {
    dispatch(dfActions.updateChartNode({
      id: node.id,
      updates: { chartType },
    }));
  };

  const handleTableChange = (tableIds: string[]) => {
    dispatch(dfActions.updateChartNode({
      id: node.id,
      updates: { tableIds },
    }));
  };

  const handleEncodingChange = (channel: string, value: string) => {
    dispatch(dfActions.updateChartNode({
      id: node.id,
      updates: {
        encodings: {
          ...node.encodings,
          [channel]: value || undefined,
        },
      },
    }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl fullWidth size="small">
        <InputLabel>Tables</InputLabel>
        <Select
          multiple
          value={node.tableIds}
          onChange={(e) => handleTableChange(e.target.value as string[])}
          label="Tables"
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((id) => {
                const table = tables.find(t => t.id === id);
                return <Chip key={id} label={table?.name} size="small" />;
              })}
            </Box>
          )}
        >
          {tables.map((table) => (
            <MenuItem key={table.id} value={table.id}>
              {table.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel>Chart Type</InputLabel>
        <Select
          value={node.chartType}
          onChange={(e) => handleChartTypeChange(e.target.value)}
          label="Chart Type"
        >
          <MenuItem value="bar">Bar Chart</MenuItem>
          <MenuItem value="line">Line Chart</MenuItem>
          <MenuItem value="scatter">Scatter Plot</MenuItem>
          <MenuItem value="area">Area Chart</MenuItem>
          <MenuItem value="pie">Pie Chart</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <FieldDropZone
          label="X Axis"
          value={node.encodings.x}
          fields={allColumns.map(c => c.full)}
          onChange={(value) => handleEncodingChange('x', value)}
        />
        <FieldDropZone
          label="Y Axis"
          value={node.encodings.y}
          fields={allColumns.map(c => c.full)}
          onChange={(value) => handleEncodingChange('y', value)}
        />
        <FieldDropZone
          label="Color"
          value={node.encodings.color}
          fields={allColumns.map(c => c.full)}
          onChange={(value) => handleEncodingChange('color', value)}
        />
        <FieldDropZone
          label="Size"
          value={node.encodings.size}
          fields={allColumns.map(c => c.full)}
          onChange={(value) => handleEncodingChange('size', value)}
        />
      </Box>
    </Box>
  );
};