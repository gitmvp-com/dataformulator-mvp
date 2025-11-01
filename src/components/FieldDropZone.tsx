import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface FieldDropZoneProps {
  label: string;
  value?: string;
  fields: string[];
  onChange: (value: string) => void;
}

export const FieldDropZone: React.FC<FieldDropZoneProps> = ({
  label,
  value,
  fields,
  onChange,
}) => {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        label={label}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {fields.map((field) => (
          <MenuItem key={field} value={field}>
            {field}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};