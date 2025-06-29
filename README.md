# 🚀 Data Alchemist - AI-Powered Resource Allocation Configurator

A comprehensive Next.js web application that transforms messy spreadsheets into clean, validated data with AI-powered insights and business rule management.

## ✨ Features

### 🎯 Core Functionality

- **Data Ingestion**: Upload CSV/XLSX files for clients, workers, and tasks
- **Interactive Data Grids**: Edit data inline with real-time validation
- **Comprehensive Validation**: 8+ validation rules with detailed error reporting
- **Business Rules Engine**: Create and manage complex business rules
- **Prioritization System**: Configure weights for resource allocation
- **Export Functionality**: Download cleaned data and configuration files

### 🤖 AI-Powered Features

- **Natural Language Search**: Search data using plain English queries
- **Natural Language Rules**: Create business rules using natural language
- **AI Data Filtering**: Advanced filtering with semantic understanding
- **Smart Validation**: AI-enhanced validation beyond basic rules

### 📊 Data Management

- **Real-time Validation**: Immediate feedback on data errors
- **Cross-reference Checks**: Validate relationships between entities
- **Error Highlighting**: Visual error indicators with detailed tooltips
- **Data Correction**: Inline editing with validation feedback

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Tables**: TanStack React Table
- **Icons**: React Icons
- **File Processing**: XLSX library
- **AI Integration**: Google Generative AI

### Project Structure

```
tidyops/
├── app/
│   ├── api/
│   │   ├── ai-query/           # Natural language search
│   │   └── natural-language-rules/ # AI rule generation
│   ├── data/                   # Main data management page
│   ├── utils/
│   │   └── validation.ts       # Validation logic
│   └── page.tsx               # Landing page
├── components/
│   ├── DataTable.tsx          # Editable data grid
│   ├── BusinessRulesPanel.tsx # Business rules management
│   ├── PrioritizationPanel.tsx # Weights configuration
│   └── ExportPanel.tsx        # Export functionality
├── store/
│   └── dataStore.ts           # Global state management
├── types/
│   └── index.ts               # TypeScript definitions
└── samples/                   # Sample data files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd tidyops

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your Google AI API key to .env.local

# Start development server
pnpm dev
```

### Environment Variables

Create a `.env.local` file:

```env
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

## 📁 Sample Data

The application includes sample data files in the `/samples` directory:

### clients.csv

```csv
ClientID,ClientName,PriorityLevel,RequestedTaskIDs,GroupTag,AttributesJSON
C001,Acme Corporation,5,"T1,T2,T3",VIP,"{""industry"": ""technology"", ""contract_value"": 500000}"
```

### workers.csv

```csv
WorkerID,WorkerName,Skills,AvailableSlots,MaxLoadPerPhase,WorkerGroup,QualificationLevel
W001,John Smith,"programming,design,testing","[1,2,3,4,5]",3,Senior,5
```

### tasks.csv

```csv
TaskID,TaskName,Category,Duration,RequiredSkills,PreferredPhases,MaxConcurrent
T1,Frontend Development,Development,2,"programming,design","[1,2,3]",3
```

## 🔧 Validation Rules

The application implements comprehensive validation:

### Core Validations (8+ implemented)

1. **Missing Required Columns**: Ensures all required fields are present
2. **Duplicate IDs**: Prevents duplicate ClientID/WorkerID/TaskID
3. **Malformed Lists**: Validates AvailableSlots format
4. **Out-of-Range Values**: Checks PriorityLevel (1-5), Duration ≥ 1
5. **Broken JSON**: Validates AttributesJSON format
6. **Unknown References**: Ensures RequestedTaskIDs exist in tasks
7. **Worker Overload**: Validates MaxLoadPerPhase vs AvailableSlots
8. **Skill Coverage**: Ensures task skills are available in workers

### Cross-Reference Validations

- Client task requests must reference existing tasks
- Task required skills must be available in worker pool
- Worker availability must support assigned load limits

## 🎛️ Business Rules

### Supported Rule Types

1. **Co-Run Rules**: Tasks that must run together
2. **Slot Restrictions**: Minimum common slots for groups
3. **Load Limits**: Maximum slots per phase for worker groups
4. **Phase Windows**: Allowed phases for specific tasks
5. **Pattern Matching**: Regex-based rule application
6. **Precedence Override**: Priority-based rule ordering

### Natural Language Examples

- "Tasks T1 and T2 must run together"
- "Limit Senior workers to 3 slots per phase"
- "Task T3 can only run in phases 1-3"
- "VIP clients need minimum 2 common slots"

## ⚖️ Prioritization System

### Configurable Weights

- **Priority Level**: Client priority importance
- **Request Fulfillment**: Completing all requested tasks
- **Fair Distribution**: Balanced workload across workers
- **Resource Efficiency**: Optimal resource utilization
- **Cost Optimization**: Minimize operational costs
- **Speed of Execution**: Faster task completion

### Preset Profiles

- **Maximize Fulfillment**: Complete all client requests
- **Fair Distribution**: Balanced worker workload
- **Minimize Workload**: Reduce worker stress
- **Cost Optimized**: Minimize operational costs

## 🔍 AI Search Features

### Natural Language Queries

- "Show all tasks with duration more than 2 phases"
- "Find workers with programming skills available in phase 3"
- "Display VIP clients requesting frontend development"
- "Show tasks that can run in phases 2-4"

### Advanced Filtering

- Semantic understanding of queries
- Entity relationship awareness
- Context-aware filtering
- Multi-entity cross-referencing

## 📤 Export Functionality

### Export Options

- **CSV Files**: Clean, validated data for each entity
- **Rules Config**: JSON configuration with all business rules
- **Prioritization Settings**: Weight configurations
- **Complete Package**: All data and settings in one export

### Export Contents

- `clients_cleaned.csv`: Validated client data
- `workers_cleaned.csv`: Validated worker data
- `tasks_cleaned.csv`: Validated task data
- `rules_config.json`: Business rules and prioritization

## 🎨 User Interface

### Design Principles

- **Non-Technical User Focus**: Intuitive interface for business users
- **Real-time Feedback**: Immediate validation and error reporting
- **Visual Error Indicators**: Clear error highlighting and tooltips
- **Progressive Disclosure**: Advanced features available when needed
- **Responsive Design**: Works on desktop and tablet devices

### Key UI Components

- **Tabbed Interface**: Organized workflow (Data → Rules → Priorities → Export)
- **Editable Tables**: Inline editing with validation
- **Visual Error States**: Color-coded error indicators
- **Interactive Forms**: Dynamic rule creation and configuration
- **Progress Indicators**: Clear status and validation feedback

## 🔒 Data Security

- **Client-side Processing**: Data stays in browser
- **No Server Storage**: Files processed locally
- **Secure Exports**: Clean data without sensitive information
- **Validation Only**: No data transmission to external services

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Other Platforms

The application can be deployed to any platform supporting Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review sample data files

## 🎯 Roadmap

### Planned Features

- **AI Rule Recommendations**: Automatic rule suggestions based on data patterns
- **Advanced Analytics**: Data insights and optimization recommendations
- **Collaborative Editing**: Multi-user support for team environments
- **Integration APIs**: Connect with external resource allocation tools
- **Advanced Validation**: Machine learning-based anomaly detection

---

**Built with ❤️ for solving spreadsheet chaos**
