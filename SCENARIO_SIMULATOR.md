# Recovery Scenario Simulator

The Recovery page now includes a **Scenario Simulator** that automatically populates the **Daily Check-in Form** with realistic recovery data for testing the daily recovery API.

## 🎯 Purpose

Pre-fill the daily check-in form with realistic recovery data patterns to test the daily recovery agent API without manual input.

## 🚀 How to Use

### Quick Test (One-Click)
- **Injury Recovery**: Pre-fills form with shoulder injury + good sleep data
- **High Fatigue**: Pre-fills form with high fatigue (9/10) + soreness data  
- **Optimal State**: Pre-fills form with perfect recovery metrics

### Detailed Testing
1. **Choose Scenario**: Select from 3 recovery patterns
2. **Pick Date**: Choose specific dates within that scenario  
3. **Click "Use This Data for Daily Check-in"**: Scrolls to and opens the daily form
4. **Click "Use Scenario Data"**: Auto-fills the form with selected data
5. **Submit**: Test the daily recovery API with realistic data

## 📊 Available Scenarios

### 1. Injury Recovery (Aug 10-12)
- **Focus**: Recovery from shoulder injury
- **Characteristics**: 
  - Shoulder injury present
  - Good sleep (8+ hours)
  - Low fatigue (1-2/10)  
  - Gradual HRV improvement (65→68 ms)

### 2. High Fatigue Period (Aug 13-15)
- **Focus**: Overreaching/overtraining phase
- **Characteristics**:
  - High fatigue (7-9/10)
  - Muscle soreness (legs, back, glutes)
  - Decreased HRV (45→38→48 ms)
  - Elevated RHR (62→65→63 bpm)

### 3. Optimal Recovery (Aug 16-19)  
- **Focus**: Well-recovered, optimal state
- **Characteristics**:
  - Excellent sleep (8-8.6 hours)
  - Low fatigue (2-5/10)
  - High HRV (55-66 ms)
  - No soreness or injuries

## 🎨 Visual Indicators

- **"Simulated Data" Badge**: Appears when using simulator
- **Color-coded Metrics**: Different colors for each data type
- **Interactive Cards**: Hover effects and selection states
- **Real-time Preview**: See selected data before applying

## 🔄 Data Flow

1. **Scenario Selection** → Updates available dates
2. **Date Selection** → Fetches mock data for that date
3. **Data Application** → Updates ReadinessSection display
4. **Timeline Integration** → Works with existing date timeline
5. **Reset Function** → Returns to normal timeline mode

## 💡 Use Cases

- **API Testing**: Test daily recovery agent with realistic data patterns
- **Demo**: Show different recovery scenarios in API responses
- **Development**: Quick form filling without manual data entry
- **Validation**: Ensure API handles edge cases (high fatigue, injuries, etc.)

## 🔧 Technical Details

- Uses existing mock data from `src/mock/recovery.mock.ts`
- Integrates with existing `ReadinessSection` component
- State management through React hooks
- Maintains compatibility with timeline navigation