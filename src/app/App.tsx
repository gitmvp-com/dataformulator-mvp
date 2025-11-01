import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { RootState } from './store';
import { dfActions } from './dfSlice';
import { MainView } from '../views/MainView';
import { DataThreadsPanel } from '../views/DataThreadsPanel';
import { TableManager } from '../views/TableManager';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
  },
});

export const App: React.FC = () => {
  const dispatch = useDispatch();
  const [configOpen, setConfigOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const apiKey = useSelector((state: RootState) => state.root.apiKey);
  const provider = useSelector((state: RootState) => state.root.provider);
  const model = useSelector((state: RootState) => state.root.model);
  const sessionId = useSelector((state: RootState) => state.root.sessionId);
  
  const [tempApiKey, setTempApiKey] = useState(apiKey || '');
  const [tempProvider, setTempProvider] = useState(provider);
  const [tempModel, setTempModel] = useState(model || '');

  const handleSaveConfig = () => {
    dispatch(dfActions.setApiKey(tempApiKey));
    dispatch(dfActions.setProvider(tempProvider));
    dispatch(dfActions.setModel(tempModel));
    setConfigOpen(false);
  };

  const handleReset = () => {
    dispatch(dfActions.resetState());
    setResetDialogOpen(false);
    window.location.reload();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              📊 Data Formulator MVP
            </Typography>
            <Typography variant="caption" sx={{ mr: 2, opacity: 0.8 }}>
              Session: {sessionId.slice(0, 8)}
            </Typography>
            <TableManager />
            <Button color="inherit" onClick={() => setConfigOpen(true)} sx={{ ml: 1 }}>
              ⚙️ Config
            </Button>
            <Button color="inherit" onClick={() => setResetDialogOpen(true)} sx={{ ml: 1 }}>
              🔄 Reset
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <MainView />
          </Box>
          <Box sx={{ width: 300, borderLeft: '1px solid #ddd', overflow: 'auto' }}>
            <DataThreadsPanel />
          </Box>
        </Box>

        {/* Config Dialog */}
        <Dialog open={configOpen} onClose={() => setConfigOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>AI Configuration</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Provider</InputLabel>
              <Select
                value={tempProvider}
                label="Provider"
                onChange={(e) => setTempProvider(e.target.value as 'openai' | 'anthropic')}
              >
                <MenuItem value="openai">OpenAI</MenuItem>
                <MenuItem value="anthropic">Anthropic</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="API Key"
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              margin="normal"
              helperText={`Enter your ${tempProvider === 'openai' ? 'OpenAI' : 'Anthropic'} API key`}
            />
            <TextField
              fullWidth
              label="Model"
              value={tempModel}
              onChange={(e) => setTempModel(e.target.value)}
              margin="normal"
              placeholder={tempProvider === 'openai' ? 'gpt-4o' : 'claude-3-5-sonnet-latest'}
              helperText="Optional: specify a model name"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfigOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveConfig} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Reset Dialog */}
        <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
          <DialogTitle>Reset Session?</DialogTitle>
          <DialogContent>
            <Typography>All data, charts, and configuration will be lost.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleReset} color="error" variant="contained">Reset</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};