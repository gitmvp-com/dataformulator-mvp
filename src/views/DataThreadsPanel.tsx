import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Chip,
} from '@mui/material';
import { RootState } from '../app/store';
import { dfActions } from '../app/dfSlice';

export const DataThreadsPanel: React.FC = () => {
  const dispatch = useDispatch();
  const chartNodes = useSelector((state: RootState) => state.root.chartNodes);
  const selectedNodeId = useSelector((state: RootState) => state.root.selectedNodeId);

  const handleCreateChart = () => {
    const tables = useSelector((state: RootState) => state.root.tables);
    if (tables.length > 0) {
      dispatch(dfActions.addChartNode({
        tableIds: [tables[0].id],
        chartType: 'bar',
        encodings: {},
      }));
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const rootNodes = chartNodes.filter(n => !n.parentId);
  
  const getChildren = (parentId: string) => {
    return chartNodes.filter(n => n.parentId === parentId);
  };

  const renderNode = (node: any, depth = 0) => {
    const children = getChildren(node.id);
    const isSelected = node.id === selectedNodeId;
    
    return (
      <React.Fragment key={node.id}>
        <ListItem
          disablePadding
          sx={{ pl: depth * 2 }}
        >
          <ListItemButton
            selected={isSelected}
            onClick={() => dispatch(dfActions.selectNode(node.id))}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label={node.chartType} size="small" />
                  <Typography variant="body2">
                    {formatTimestamp(node.timestamp)}
                  </Typography>
                </Box>
              }
              secondary={node.prompt ? node.prompt.slice(0, 50) + '...' : 'Manual chart'}
            />
          </ListItemButton>
        </ListItem>
        {children.map(child => renderNode(child, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Data Threads</Typography>
        <Button size="small" variant="outlined" onClick={handleCreateChart}>
          + New
        </Button>
      </Box>
      
      {chartNodes.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          No charts yet. Create your first chart!
        </Typography>
      ) : (
        <List sx={{ flex: 1, overflow: 'auto' }}>
          {rootNodes.map(node => renderNode(node))}
        </List>
      )}
    </Box>
  );
};