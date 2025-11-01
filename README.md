# 📊 Data Formulator MVP

An MVP version of [Microsoft's Data Formulator](https://github.com/microsoft/data-formulator) - an AI-powered data visualization tool that combines UI interactions with natural language to create rich visualizations.

## ✨ Features

This MVP includes:

✅ **Chart Type Selection & Manual Visualization** - Choose chart types (bar, line, scatter, area, pie) and drag-and-drop fields to create visualizations

✅ **AI-Powered Data Transformation** - Use AI (OpenAI/Anthropic) to transform data and generate visualizations based on natural language prompts

✅ **Multiple Chart Types with Vega-Lite** - Support for various chart types using Vega-Lite

✅ **Data Threads / History Tracking** - Track exploration history and create branches of analysis

✅ **Multiple Dataset Join** - Work with multiple datasets and join them

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Python 3.9+
- OpenAI API key or Anthropic API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gitmvp-com/dataformulator-mvp.git
   cd dataformulator-mvp
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install Python backend dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   # OpenAI Configuration
   OPENAI_API_KEY=your-openai-api-key-here
   
   # Or Anthropic Configuration
   ANTHROPIC_API_KEY=your-anthropic-api-key-here
   ```

### Running the Application

1. **Start the Python backend** (in one terminal):
   ```bash
   python backend/server.py
   ```

2. **Start the frontend** (in another terminal):
   ```bash
   npm start
   # or
   yarn start
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

## 📖 How to Use

### 1. Upload Data
- Click "Add Table" to upload a CSV or Excel file
- Or paste data from clipboard

### 2. Create Visualizations Manually
- Select a chart type (bar, line, scatter, area, pie)
- Drag and drop fields to encoding channels (x, y, color, size)
- View the generated chart

### 3. Use AI to Transform Data
- Type field names that don't exist in your data
- Provide a natural language prompt (e.g., "calculate average sales by month")
- Click "Formulate" to let AI generate the transformation
- Review the generated chart and transformation code

### 4. Track Your Analysis
- All your visualizations are tracked in the Data Threads panel
- Create follow-up visualizations based on previous ones
- Branch your analysis in different directions

### 5. Work with Multiple Datasets
- Upload multiple tables
- Specify which tables to use in your visualization
- AI will automatically join tables based on your intent

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI** for UI components
- **Redux Toolkit** for state management
- **Vega-Lite** for declarative visualizations
- **React-DnD** for drag-and-drop interactions
- **Vite** for fast development

### Backend
- **Python Flask** for API server
- **Pandas** for data manipulation
- **OpenAI API** / **Anthropic API** for AI transformations

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes (if using OpenAI) |
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Yes (if using Anthropic) |
| `API_PORT` | Backend server port (default: 5000) | No |

## 🎯 Differences from Full Version

This MVP focuses on core features:
- ✅ Basic chart creation and AI transformations
- ✅ History tracking and multi-dataset support
- ❌ Large dataset support (DuckDB)
- ❌ Data anchoring feature
- ❌ External data loaders (MySQL, PostgreSQL, etc.)
- ❌ Advanced data grid features
- ❌ Export to various formats

## 📄 License

MIT License - Based on [microsoft/data-formulator](https://github.com/microsoft/data-formulator)

## 🙏 Acknowledgments

This MVP is inspired by and based on Microsoft Research's Data Formulator project. Check out their [research paper](https://arxiv.org/abs/2408.16119) for more details.

## 🐛 Issues & Contributions

Feel free to open issues or contribute to this project!
