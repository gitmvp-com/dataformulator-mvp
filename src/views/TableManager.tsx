import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { dfActions } from '../app/dfSlice';
import { RootState } from '../app/store';
import * as XLSX from 'xlsx';

export const TableManager: React.FC = () => {
  const dispatch = useDispatch();
  const tables = useSelector((state: RootState) => state.root.tables);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [pasteDialogOpen, setPasteDialogOpen] = useState(false);
  const [pasteData, setPasteData] = useState('');
  const [tableName, setTableName] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      if (jsonData.length > 0) {
        const columns = Object.keys(jsonData[0] as object);
        dispatch(dfActions.addTable({
          name: tableName || file.name.replace(/\.[^/.]+$/, ''),
          data: jsonData,
          columns,
        }));
        setUploadDialogOpen(false);
        setTableName('');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handlePasteData = () => {
    try {
      const rows = pasteData.trim().split('\n');
      const columns = rows[0].split('\t');
      const data = rows.slice(1).map(row => {
        const values = row.split('\t');
        const obj: any = {};
        columns.forEach((col, i) => {
          obj[col] = values[i];
        });
        return obj;
      });
      
      dispatch(dfActions.addTable({
        name: tableName || 'Pasted Data',
        data,
        columns,
      }));
      setPasteDialogOpen(false);
      setPasteData('');
      setTableName('');
    } catch (error) {
      alert('Failed to parse data. Make sure it\'s tab-separated.');
    }
  };

  return (
    <>
      <Button color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
        📊 Tables ({tables.length})
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => { setUploadDialogOpen(true); setAnchorEl(null); }}>
          📁 Upload File
        </MenuItem>
        <MenuItem onClick={() => { setPasteDialogOpen(true); setAnchorEl(null); }}>
          📋 Paste Data
        </MenuItem>
        {tables.length > 0 && <MenuItem disabled>Current Tables:</MenuItem>}
        {tables.map(table => (
          <MenuItem key={table.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText primary={table.name} secondary={`${table.data.length} rows`} />
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(dfActions.removeTable(table.id));
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </MenuItem>
        ))}
      </Menu>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)}>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Table Name (Optional)"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            margin="normal"
          />
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            style={{ marginTop: 16 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Paste Dialog */}
      <Dialog open={pasteDialogOpen} onClose={() => setPasteDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Paste Data</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Table Name"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            multiline
            rows={10}
            label="Paste tab-separated data"
            value={pasteData}
            onChange={(e) => setPasteData(e.target.value)}
            margin="normal"
            helperText="First row should be column headers, tab-separated"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePasteData} variant="contained">Add Table</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};