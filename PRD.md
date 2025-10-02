# Model Comparison Tool

A streamlined tool for evaluating and comparing AI model responses side by side using standardized criteria.

**Experience Qualities**:
1. **Analytical** - Interface supports careful, methodical comparison of model outputs
2. **Efficient** - Streamlined workflow allows quick evaluation without cognitive overhead  
3. **Focused** - Clean, distraction-free design keeps attention on the content being evaluated

**Complexity Level**: Light Application (multiple features with basic state)
- Multiple interactive rating components with persistent state for evaluation sessions

## Essential Features

**Query Display**
- Functionality: Shows the original question/prompt that was sent to both models
- Purpose: Provides context for evaluating response quality and relevance
- Trigger: Always visible at top of interface
- Progression: Static display → provides context for evaluation
- Success criteria: Question is clearly readable and provides sufficient context

**Side-by-Side Response Display**
- Functionality: Displays Model A and Model B responses in parallel columns
- Purpose: Enables direct comparison of response quality, style, and content
- Trigger: Responses load automatically when evaluation session begins
- Progression: Load responses → display in parallel → enable comparison workflow
- Success criteria: Both responses are fully visible and easily comparable

**Three-Metric Rating System**
- Functionality: Rate each criterion on 5-point preference scale (Strongly prefer A → Strongly prefer B)
- Purpose: Standardizes evaluation process across key quality dimensions
- Trigger: User selects rating for each of the three metrics
- Progression: Review responses → evaluate criterion → select preference → repeat for all metrics → submit evaluation
- Success criteria: All three ratings captured, clear visual feedback on selections

**Evaluation Results Summary**
- Functionality: Displays overall comparison results based on metric ratings
- Purpose: Provides clear summary of model performance across criteria
- Trigger: After completing all three metric evaluations
- Progression: Complete ratings → calculate results → display summary with breakdown
- Success criteria: Results clearly show which model performed better overall

## Edge Case Handling

- **Missing Responses**: Display placeholder text if model response is empty or failed to load
- **Long Responses**: Implement scrollable areas to handle varying response lengths
- **Incomplete Ratings**: Prevent submission until all three metrics are rated
- **Rating Changes**: Allow users to modify ratings before final submission

## Design Direction

The interface should feel professional and analytical, like a research tool used by ML engineers and researchers. Clean, minimal design with clear visual hierarchy that keeps focus on the content being evaluated rather than the interface itself.

## Color Selection

Complementary (opposite colors) - Using a blue-orange palette to create clear visual distinction between Model A and Model B while maintaining professional appearance.

- **Primary Color**: Deep Blue (oklch(0.45 0.15 240)) - Represents Model A and primary actions, communicates trust and reliability
- **Secondary Colors**: Warm Orange (oklch(0.65 0.15 60)) - Represents Model B, provides clear visual distinction
- **Accent Color**: Bright Blue (oklch(0.55 0.20 240)) - For interactive elements and emphasis
- **Foreground/Background Pairings**:
  - Background (White oklch(1 0 0)): Dark text (oklch(0.15 0 0)) - Ratio 21:1 ✓
  - Primary (Deep Blue oklch(0.45 0.15 240)): White text (oklch(1 0 0)) - Ratio 8.2:1 ✓
  - Secondary (Warm Orange oklch(0.65 0.15 60)): White text (oklch(1 0 0)) - Ratio 4.7:1 ✓
  - Accent (Bright Blue oklch(0.55 0.20 240)): White text (oklch(1 0 0)) - Ratio 6.1:1 ✓

## Font Selection

Clean, highly legible sans-serif typography that supports both scanning and detailed reading of model responses.

- **Typographic Hierarchy**:
  - H1 (Page Title): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter Semibold/24px/normal letter spacing  
  - H3 (Model Labels): Inter Medium/18px/normal letter spacing
  - Body (Responses): Inter Regular/16px/relaxed line height for readability
  - Labels (Rating Options): Inter Medium/14px/normal letter spacing

## Animations

Subtle, functional animations that provide feedback and guide attention without distraction.

- **Purposeful Meaning**: Smooth transitions communicate selection states and provide confidence in user actions
- **Hierarchy of Movement**: Rating selection animations take priority, followed by subtle hover states on interactive elements

## Component Selection

- **Components**: 
  - Card components for response containers with subtle shadows
  - RadioGroup for rating scales with custom styling
  - Button for primary actions (submit evaluation)
  - Separator for visual organization
  - Badge components for metric labels
- **Customizations**: Custom radio button styling to show preference scale visually
- **States**: Clear hover, selected, and disabled states for rating components
- **Icon Selection**: Minimal use - checkmarks for completed ratings, arrows for navigation if needed
- **Spacing**: Consistent 4-unit (16px) spacing between major sections, 2-unit (8px) for related elements
- **Mobile**: Single column layout on mobile with collapsible response sections for easier comparison