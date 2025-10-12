# BentoGrid Component

A responsive grid layout system inspired by Bento Box design, perfect for creating modern dashboard layouts with items of varying sizes.

## Components

### BentoGrid (Container)

### BentoItem (Grid Item)

## Props

### BentoGrid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | **Required.** BentoItem components |
| `columns` | `2 \| 3 \| 4 \| 6` | `3` | Number of columns in the grid |
| `gap` | `"small" \| "medium" \| "large"` | `"medium"` | Space between grid items |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | All standard HTML div attributes |

### BentoItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | **Required.** Item content |
| `colSpan` | `1 \| 2 \| 3 \| 4 \| 6` | `1` | Number of columns to span |
| `rowSpan` | `1 \| 2 \| 3 \| 4` | `1` | Number of rows to span |
| `variant` | `"default" \| "elevated" \| "outlined"` | `"default"` | Visual style variant |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | All standard HTML div attributes |

## Usage Examples

```tsx
// Basic 3-column grid
<BentoGrid>
  <BentoItem>Item 1</BentoItem>
  <BentoItem>Item 2</BentoItem>
  <BentoItem>Item 3</BentoItem>
</BentoGrid>

// 4-column grid with custom gap
<BentoGrid columns={4} gap="large">
  <BentoItem>Item 1</BentoItem>
  <BentoItem>Item 2</BentoItem>
  <BentoItem>Item 3</BentoItem>
  <BentoItem>Item 4</BentoItem>
</BentoGrid>

// Items with different spans
<BentoGrid columns={4}>
  <BentoItem colSpan={2}>Wide Item</BentoItem>
  <BentoItem>Regular</BentoItem>
  <BentoItem>Regular</BentoItem>
  <BentoItem colSpan={4} rowSpan={2}>Full Width Tall</BentoItem>
</BentoGrid>

// Items with different variants
<BentoGrid columns={3}>
  <BentoItem variant="elevated">Elevated Card</BentoItem>
  <BentoItem variant="outlined">Outlined Card</BentoItem>
  <BentoItem variant="default">Default Card</BentoItem>
</BentoGrid>
```

## Common Use Cases

### Dashboard Layout

```tsx
<BentoGrid columns={4} gap="medium">
  {/* Header spanning full width */}
  <BentoItem colSpan={4} variant="elevated">
    <h1>Dashboard</h1>
  </BentoItem>

  {/* Main content area */}
  <BentoItem colSpan={3} rowSpan={2} variant="elevated">
    <Chart data={chartData} />
  </BentoItem>

  {/* Sidebar widgets */}
  <BentoItem variant="outlined">
    <Stats title="Users" value="1,234" />
  </BentoItem>
  <BentoItem variant="outlined">
    <Stats title="Revenue" value="$45K" />
  </BentoItem>

  {/* Footer items */}
  <BentoItem colSpan={2}>
    <RecentActivity />
  </BentoItem>
  <BentoItem colSpan={2}>
    <Notifications />
  </BentoItem>
</BentoGrid>
```

### Feature Grid

```tsx
<BentoGrid columns={3} gap="large">
  <BentoItem colSpan={2} rowSpan={2} variant="elevated">
    <img src="/hero-feature.jpg" alt="Main Feature" />
    <h2>Main Feature</h2>
    <p>Description of the main feature</p>
  </BentoItem>

  <BentoItem variant="outlined">
    <Icon name="fast" />
    <h3>Fast</h3>
    <p>Lightning fast performance</p>
  </BentoItem>

  <BentoItem variant="outlined">
    <Icon name="secure" />
    <h3>Secure</h3>
    <p>Bank-level security</p>
  </BentoItem>

  <BentoItem colSpan={3}>
    <CallToAction />
  </BentoItem>
</BentoGrid>
```

### Portfolio Gallery

```tsx
<BentoGrid columns={6} gap="small">
  <BentoItem colSpan={3} rowSpan={2}>
    <ProjectCard project={projects[0]} featured />
  </BentoItem>
  <BentoItem colSpan={2}>
    <ProjectCard project={projects[1]} />
  </BentoItem>
  <BentoItem colSpan={1} rowSpan={2}>
    <ProjectCard project={projects[2]} vertical />
  </BentoItem>
  <BentoItem colSpan={2}>
    <ProjectCard project={projects[3]} />
  </BentoItem>
  <BentoItem colSpan={3}>
    <ProjectCard project={projects[4]} />
  </BentoItem>
</BentoGrid>
```

### Analytics Dashboard

```tsx
<BentoGrid columns={4} gap="medium">
  <BentoItem colSpan={4}>
    <PageHeader title="Analytics" />
  </BentoItem>

  <BentoItem colSpan={2} rowSpan={2} variant="elevated">
    <LineChart data={timeSeriesData} />
  </BentoItem>

  <BentoItem variant="elevated">
    <MetricCard title="Page Views" value="45.2K" change="+12%" />
  </BentoItem>

  <BentoItem variant="elevated">
    <MetricCard title="Bounce Rate" value="32%" change="-5%" />
  </BentoItem>

  <BentoItem colSpan={2} variant="outlined">
    <TopPages data={pagesData} />
  </BentoItem>

  <BentoItem colSpan={2} variant="outlined">
    <GeographyMap data={geoData} />
  </BentoItem>

  <BentoItem colSpan={2} variant="outlined">
    <DeviceBreakdown data={deviceData} />
  </BentoItem>
</BentoGrid>
```

## Responsive Behavior

The BentoGrid is **fully responsive** with automatic breakpoints:

### Desktop (> 1024px)

- Uses specified column count
- All spans work as defined

### Tablet (768px - 1024px)

- 6 columns → 3 columns
- 4 columns → 2 columns
- 3 columns → 3 columns
- Items with span > 2 become span 2
- Single items become span 1

### Mobile (< 768px)

- All grids become 2 columns
- Large items (span 3+) become span 2
- Regular items become span 1
- Row spans reset to 1
- Reduced padding and gaps

### Small Mobile (< 480px)

- Single column layout
- All items full width
- All spans reset to 1
- Minimal gaps

## Item Variants

- **Default**: Filled background with subtle border
- **Elevated**: Shadow with hover lift effect
- **Outlined**: Transparent with border, fills on hover

## Gap Sizes

- **Small**: 0.5rem
- **Medium**: 1rem (default)
- **Large**: 1.5rem

## Styling

- Automatic responsive behavior
- Smooth transitions
- Consistent with design system
- Custom className support for both Grid and Items
- Inline styles for spans (grid-column, grid-row)

## Best Practices

1. **Column Planning**: Use 4 or 6 columns for maximum flexibility
2. **Span Ratios**: Keep span values as factors of total columns
3. **Mobile First**: Design works on mobile, then enhance for desktop
4. **Content Hierarchy**: Use larger spans for important content
5. **Visual Balance**: Mix elevated and outlined variants
6. **Consistent Heights**: Use rowSpan for visual rhythm
7. **Responsive Testing**: Test on all breakpoints

## Notes

- Grid uses CSS Grid Layout
- Minimum row height: 120px (100px on mobile)
- Items are flex containers by default
- Spans are applied via inline styles
- Responsive behavior is automatic via CSS media queries
- All items have rounded corners and padding
- Hover effects on elevated and outlined variants
