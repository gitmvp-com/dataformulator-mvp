import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Paper, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { RootState, AppDispatch } from '../app/store';
import { dfActions, formulateChart } from '../app/dfSlice';
import { ChartEditor } from './ChartEditor';
import { ChartViewer } from './ChartViewer';

export const MainView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedNodeId = useSelector((state: RootState) => state.root.selectedNodeId);
  const selectedNode = useSelector((state: RootState) => 
    state.root.chartNodes.find(n => n.id === selectedNodeId)
  );
  const tables = useSelector((state: RootState) => state.root.tables);
  const apiKey = useSelector((state: RootState) => state.root.apiKey);

  const [prompt, setPrompt] = useState('');
  const [isFormulating, setIsFormulating] = useState(false);

  const handleCreateChart = () => {
    if (tables.length === 0) {
      alert('Please add a table first');
      return;
    }
    
    dispatch(dfActions.addChartNode({
      tableIds: [tables[0].id],
      chartType: 'bar',
      encodings: {},
    }));
  };

  const handleFormulate = async () => {
    if (!selectedNode) return;
    if (!apiKey) {
      alert('Please configure your API key in Config');
      return;
    }

    setIsFormulating(true);
    try {
      await dispatch(formulateChart({
        nodeId: selectedNode.id,
        prompt,
        tableIds: selectedNode.tableIds,
        encodings: selectedNode.encodings,
      }));
    } catch (error) {
      console.error('Formulation error:', error);
      alert('Failed to formulate chart. Check console for details.');
    } finally {
      setIsFormulating(false);
    }
  };

  if (tables.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Welcome to Data Formulator MVP!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Start by adding a table using the "Add Table" button in the top toolbar.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          💡 Tip: You can upload CSV/Excel files or paste data from clipboard
        </Typography>
      </Box>
    );
  }

  if (!selectedNode) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Ready to create visualizations!
        </Typography>
        <Button variant="contained" onClick={handleCreateChart} size="large">
          Create New Chart
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Chart Editor
        </Typography>
        <ChartEditor node={selectedNode} />
        
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Natural Language Prompt (Optional)"
            placeholder="E.g., 'Show average sales by category' or 'Calculate monthly growth rate'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleFormulate}
            disabled={isFormulating}
            fullWidth
          >
            {isFormulating ? 'Formulating...' : '🪄 Formulate with AI'}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, flex: 1, overflow: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          Visualization
        </Typography>
        <ChartViewer node={selectedNode} />
      </Paper>
    </Box>
  );
};