import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface DataTable {
  id: string;
  name: string;
  data: any[];
  columns: string[];
}

export interface ChartNode {
  id: string;
  parentId?: string;
  tableIds: string[];
  chartType: 'bar' | 'line' | 'scatter' | 'area' | 'pie';
  encodings: {
    x?: string;
    y?: string;
    color?: string;
    size?: string;
  };
  prompt?: string;
  vegaLiteSpec?: any;
  transformedData?: any[];
  code?: string;
  timestamp: number;
}

export interface DataFormulatorState {
  tables: DataTable[];
  chartNodes: ChartNode[];
  selectedNodeId?: string;
  apiKey?: string;
  provider: 'openai' | 'anthropic';
  model?: string;
  sessionId: string;
}

const initialState: DataFormulatorState = {
  tables: [],
  chartNodes: [],
  provider: 'openai',
  sessionId: uuidv4(),
};

export const formulateChart = createAsyncThunk(
  'df/formulate',
  async (payload: { nodeId: string; prompt: string; tableIds: string[]; encodings: any }, { getState }) => {
    const state = getState() as { root: DataFormulatorState };
    const tables = state.root.tables.filter(t => payload.tableIds.includes(t.id));
    
    const response = await fetch('/api/formulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tables: tables.map(t => ({ name: t.name, data: t.data, columns: t.columns })),
        prompt: payload.prompt,
        encodings: payload.encodings,
        apiKey: state.root.apiKey,
        provider: state.root.provider,
        model: state.root.model,
      }),
    });
    
    const result = await response.json();
    return { nodeId: payload.nodeId, ...result };
  }
);

const dfSlice = createSlice({
  name: 'dataFormulator',
  initialState,
  reducers: {
    addTable: (state, action: PayloadAction<{ name: string; data: any[]; columns: string[] }>) => {
      state.tables.push({
        id: uuidv4(),
        ...action.payload,
      });
    },
    removeTable: (state, action: PayloadAction<string>) => {
      state.tables = state.tables.filter(t => t.id !== action.payload);
    },
    addChartNode: (state, action: PayloadAction<Omit<ChartNode, 'id' | 'timestamp'>>) => {
      const newNode: ChartNode = {
        ...action.payload,
        id: uuidv4(),
        timestamp: Date.now(),
      };
      state.chartNodes.push(newNode);
      state.selectedNodeId = newNode.id;
    },
    updateChartNode: (state, action: PayloadAction<{ id: string; updates: Partial<ChartNode> }>) => {
      const node = state.chartNodes.find(n => n.id === action.payload.id);
      if (node) {
        Object.assign(node, action.payload.updates);
      }
    },
    selectNode: (state, action: PayloadAction<string>) => {
      state.selectedNodeId = action.payload;
    },
    setApiKey: (state, action: PayloadAction<string>) => {
      state.apiKey = action.payload;
    },
    setProvider: (state, action: PayloadAction<'openai' | 'anthropic'>) => {
      state.provider = action.payload;
    },
    setModel: (state, action: PayloadAction<string>) => {
      state.model = action.payload;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(formulateChart.fulfilled, (state, action) => {
      const node = state.chartNodes.find(n => n.id === action.payload.nodeId);
      if (node) {
        node.transformedData = action.payload.transformedData;
        node.vegaLiteSpec = action.payload.vegaLiteSpec;
        node.code = action.payload.code;
      }
    });
  },
});

export const dfActions = dfSlice.actions;
export const dataFormulatorReducer = dfSlice.reducer;