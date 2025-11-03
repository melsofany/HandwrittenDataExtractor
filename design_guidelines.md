# تصميم تطبيق معالجة الخط اليدوي العربي - Design Guidelines

## Design Approach
**System-Based Approach: Material Design 3** - Selected for its robust RTL support, comprehensive form components, and professional data-handling patterns suitable for document processing applications.

## Layout System & RTL Configuration

**RTL (Right-to-Left) Implementation:**
- All layouts flow from right to left
- Text alignment: right-aligned by default
- Navigation, buttons, and icons mirror horizontally
- Form inputs align right with labels on the right side

**Spacing System:**
Use Tailwind units: **2, 4, 6, 8, 12, 16** for consistent rhythm
- Compact spacing: p-2, gap-2 (tight UI elements)
- Standard spacing: p-4, gap-4 (form fields, cards)
- Section spacing: py-12, py-16 (vertical sections)
- Container padding: px-6 md:px-12 (responsive horizontal padding)

**Container Structure:**
- Max width: max-w-6xl mx-auto for main content
- Upload area: max-w-2xl for focused interaction
- Data table: Full width with horizontal scroll on mobile

## Typography (Arabic-Optimized)

**Font Family:**
Primary: 'Cairo' from Google Fonts (excellent Arabic rendering, multiple weights)
Code/Numbers: 'IBM Plex Sans Arabic' for national ID display

**Type Scale:**
- Headings (h1): text-3xl md:text-4xl font-bold (main page title)
- Headings (h2): text-2xl font-semibold (section headers)
- Headings (h3): text-xl font-medium (card titles)
- Body: text-base leading-relaxed (descriptions, instructions)
- Small: text-sm (helper text, status messages)
- Numbers/IDs: text-lg font-mono tracking-wide (national IDs)

## Component Library

### 1. Header Navigation
- Fixed top header with subtle shadow
- Logo/title on right side (RTL)
- Navigation items: right to left
- Action buttons group on left side
- Height: h-16
- Padding: px-6

### 2. Upload Zone (Primary Interaction)
**Drag-and-Drop Area:**
- Large target: min-h-64 md:min-h-80
- Dashed border with rounded corners (rounded-2xl)
- Icon: Upload cloud icon (80x80px) centered
- Primary text: "اسحب الصورة هنا أو انقر للاختيار"
- Secondary text: "يدعم JPG, PNG - حد أقصى 10 ميجابايت"
- Padding: p-12
- Hover state: Lift effect with subtle scale

**File Input Button:**
- Secondary button style below upload area
- Icon + text: "اختر ملف"
- Size: px-8 py-3

### 3. Image Preview Component
**Preview Card:**
- Two-column layout on desktop (grid-cols-1 md:grid-cols-2)
- Left column: Uploaded image with max-h-96, object-fit: contain
- Right column: Image metadata and actions
- Border: border-2 rounded-xl
- Padding: p-6
- Gap: gap-6

**Metadata Display:**
- File name: font-medium text-lg
- File size: text-sm
- Dimensions: text-sm
- Actions: Remove/Replace buttons in button group

### 4. Processing Status Indicator
**Progress Component:**
- Full-width container with rounded-lg
- Progress bar: h-3 with smooth animation
- Status text above: "جاري المعالجة..." with spinner icon
- Percentage display: text-sm on the right
- Padding: p-6
- Steps indicator: "1 من 3: تحليل الصورة..."

### 5. Data Preview Table
**Table Structure:**
- Responsive: Scroll horizontally on mobile
- Header row: Sticky with enhanced font-weight
- Columns: 
  - Right: "الاسم الكامل" (Name) - flex-grow
  - Left: "الرقم القومي" (National ID) - fixed width: w-48
  - Actions: Edit/Delete icons - w-24
- Row height: h-14
- Alternating row treatment for readability
- Border: Full table border with rounded-xl

**Editable Cells:**
- Click to edit inline
- Input appears with focus state
- Save/Cancel micro-actions

### 6. Action Buttons Panel
**Primary Actions:**
- Button group with gap-4
- Primary: "إنشاء ملف Google Sheets" (full CTA)
- Secondary: "تنزيل كملف Excel"
- Tertiary: "إضافة صورة أخرى"
- Size: px-6 py-3 text-base
- Icons: Leading icons for all buttons

### 7. Statistics Cards
**Overview Cards (3-column grid):**
- Grid: grid-cols-1 md:grid-cols-3 gap-6
- Each card: p-6 rounded-xl
- Large number: text-4xl font-bold
- Label: text-sm
- Icon: Top-right corner (32x32)
- Cards show: Total records, Successful, Errors

### 8. Error/Success Notifications
**Toast Notifications:**
- Fixed bottom-right position (bottom-6 right-6)
- Max-width: max-w-sm
- Padding: p-4
- Icon + message + close button
- Auto-dismiss after 5 seconds
- Slide-in animation from left (RTL)

### 9. Empty State
**No Data View:**
- Centered content: flex flex-col items-center
- Icon: 120x120px (document illustration)
- Heading: text-xl font-medium
- Description: text-base max-w-md text-center
- CTA button below
- Spacing: gap-6
- Padding: py-16

## Page Layout Structure

**Single Page Application Layout:**

1. **Header** (h-16, fixed)
2. **Main Content Area** (min-h-screen pt-16)
   - Upload Section (py-12)
   - Processing Status (conditional, py-8)
   - Data Preview Table (py-8)
   - Statistics Cards (py-8)
   - Action Panel (py-8, sticky bottom on scroll)
3. **Footer** (py-6, border-top)
   - Links: Privacy, Terms, Support (right to left)
   - Copyright on left

## Interaction Patterns

**Upload Flow:**
1. Drag-and-drop or click upload area
2. Image preview appears with metadata
3. "معالجة الصورة" button activates
4. Progress indicator shows processing steps
5. Data table populates with results
6. Edit capability for corrections
7. Final action: Create Google Sheet

**Responsive Behavior:**
- Mobile: Single column stack, full-width components
- Tablet: Two-column where appropriate
- Desktop: Full multi-column layouts with max-width containers

## Accessibility & RTL Excellence

- All text content in Arabic
- Proper dir="rtl" on html element
- Form labels clearly associated with inputs
- Keyboard navigation follows RTL flow
- Focus indicators on all interactive elements
- ARIA labels in Arabic for screen readers
- Sufficient contrast for all text (WCAG AA minimum)
- Touch targets minimum 44x44px for mobile

## Images

**Hero Section: None** - This is a utility application focused on immediate functionality. The upload zone serves as the primary visual focal point.

**Illustrations:**
- Empty state: Custom illustration of documents/papers (use Undraw or similar, RTL-appropriate)
- Processing state: Abstract data processing graphic
- Success state: Checkmark with document icon

**Icons:**
Use Material Symbols (outlined style) for consistency:
- Upload: cloud_upload
- Processing: autorenew (spinning)
- Success: check_circle
- Error: error
- Edit: edit
- Delete: delete
- Download: download
- Add: add_circle