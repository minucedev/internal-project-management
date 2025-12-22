# Tailwind CSS Configuration & Color Palette Guide

## Overview

This project uses Tailwind CSS with a custom color palette designed for consistency across the application. All developers MUST use these predefined colors to avoid style conflicts.

## Installation

Tailwind CSS is already configured. Dependencies:
- `tailwindcss` - ^3.4.0
- `postcss` - Latest
- `autoprefixer` - Latest

## Color Palette

### Primary Colors (Purple Gradient Theme)
Used for main brand elements, primary buttons, and key UI components.

```tsx
// Usage examples:
className="bg-primary-500 text-primary-600 hover:bg-primary-700"
```

| Shade | Hex | Usage |
|-------|-----|-------|
| primary-50 | #f5f3ff | Very light backgrounds |
| primary-100 | #ede9fe | Light backgrounds |
| primary-200 | #ddd6fe | Hover states (light) |
| primary-300 | #c4b5fd | Borders, dividers |
| primary-400 | #a78bfa | Secondary elements |
| **primary-500** | **#8b5cf6** | **Main primary color** |
| primary-600 | #7c3aed | Primary buttons |
| primary-700 | #6d28d9 | Hover states |
| primary-800 | #5b21b6 | Active states |
| primary-900 | #4c1d95 | Dark emphasis |
| primary-950 | #2e1065 | Very dark emphasis |

### Secondary Colors (Deep Purple/Indigo)
Used for secondary actions, complementary elements.

```tsx
className="bg-secondary-500 text-secondary-600"
```

| Shade | Hex | Usage |
|-------|-----|-------|
| secondary-50 | #faf5ff | Very light backgrounds |
| secondary-100 | #f3e8ff | Light backgrounds |
| secondary-200 | #e9d5ff | Hover states (light) |
| secondary-300 | #d8b4fe | Borders |
| secondary-400 | #c084fc | Secondary elements |
| **secondary-500** | **#a855f7** | **Main secondary color** |
| secondary-600 | #9333ea | Secondary buttons |
| secondary-700 | #7e22ce | Hover states |
| secondary-800 | #6b21a8 | Active states |
| secondary-900 | #581c87 | Dark emphasis |
| secondary-950 | #3b0764 | Very dark emphasis |

### Accent Colors
Special colors for gradients and highlights.

```tsx
className="bg-accent-blue text-accent-purple"
```

| Color | Hex | Usage |
|-------|-----|-------|
| accent-blue | #667eea | Gradient start, highlights |
| accent-purple | #764ba2 | Gradient end, highlights |
| accent-indigo | #5a67d8 | Alternative accent |

### Semantic Colors

#### Success (Green)
```tsx
className="bg-success-500 text-success-600"
```

| Shade | Hex | Usage |
|-------|-----|-------|
| success-50 | #f0fdf4 | Light backgrounds |
| success-100 | #dcfce7 | Alerts, notifications |
| **success-500** | **#22c55e** | **Main success** |
| success-600 | #16a34a | Success buttons |
| success-700 | #15803d | Hover states |

#### Warning (Amber)
```tsx
className="bg-warning-500 text-warning-600"
```

| Shade | Hex | Usage |
|-------|-----|-------|
| warning-50 | #fffbeb | Light backgrounds |
| warning-100 | #fef3c7 | Alerts, notifications |
| **warning-500** | **#f59e0b** | **Main warning** |
| warning-600 | #d97706 | Warning buttons |
| warning-700 | #b45309 | Hover states |

#### Error (Red)
```tsx
className="bg-error-500 text-error-600"
```

| Shade | Hex | Usage |
|-------|-----|-------|
| error-50 | #fef2f2 | Light backgrounds |
| error-100 | #fee2e2 | Alerts, notifications |
| **error-500** | **#ef4444** | **Main error** |
| error-600 | #dc2626 | Error buttons |
| error-700 | #b91c1c | Hover states |

### Neutral Colors (Grays)
For text, backgrounds, borders.

```tsx
className="bg-neutral-100 text-neutral-900"
```

| Shade | Hex | Usage |
|-------|-----|-------|
| neutral-50 | #fafafa | Almost white |
| neutral-100 | #f5f5f5 | Light backgrounds |
| neutral-200 | #e5e5e5 | Borders |
| neutral-300 | #d4d4d4 | Dividers |
| neutral-400 | #a3a3a3 | Placeholders |
| neutral-500 | #737373 | Secondary text |
| neutral-600 | #525252 | Body text |
| neutral-700 | #404040 | Headings |
| neutral-800 | #262626 | Emphasis |
| neutral-900 | #171717 | Strong emphasis |
| neutral-950 | #0a0a0a | Almost black |

## Gradient Utilities

### Pre-configured Gradients

```tsx
// Primary gradient (purple)
className="bg-gradient-primary"
// Renders: linear-gradient(135deg, #667eea 0%, #764ba2 100%)

// Secondary gradient (pink to red)
className="bg-gradient-secondary"
// Renders: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)

// Success gradient (blue)
className="bg-gradient-success"
// Renders: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)
```

## Custom Component Classes

### Buttons

```tsx
// Primary button
className="btn-primary"
// Equivalent: bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-2.5 rounded-lg

// Secondary button
className="btn-secondary"
// Equivalent: bg-secondary-600 hover:bg-secondary-700 text-white font-medium px-6 py-2.5 rounded-lg
```

### Cards

```tsx
// Card shadow
className="card-shadow"
// Equivalent: shadow-card (0 4px 16px rgba(0, 0, 0, 0.08))
```

### Text Gradient

```tsx
// Gradient text effect
className="text-gradient"
// Renders gradient from primary-600 to secondary-600 on text
```

## Usage Examples

### Authentication Pages
```tsx
// Container with gradient background
<div className="min-h-screen flex items-center justify-center bg-gradient-primary p-4">
  {/* Card with shadow */}
  <Card className="w-full max-w-2xl shadow-strong rounded-2xl">
    {/* Content */}
  </Card>
</div>
```

### Buttons
```tsx
// Primary action
<Button className="btn-primary">
  Submit
</Button>

// With hover state
<Button className="bg-primary-600 hover:bg-primary-700 text-white">
  Click Me
</Button>
```

### Text Colors
```tsx
// Heading
<h1 className="text-3xl font-bold text-neutral-900">Title</h1>

// Body text
<p className="text-neutral-600">Description text</p>

// Link
<a className="text-primary-600 hover:text-primary-700 font-medium">
  Link text
</a>
```

### Status Indicators
```tsx
// Success message
<div className="bg-success-100 text-success-700 p-4 rounded-lg">
  Success!
</div>

// Error message
<div className="bg-error-100 text-error-700 p-4 rounded-lg">
  Error occurred
</div>

// Warning message
<div className="bg-warning-100 text-warning-700 p-4 rounded-lg">
  Warning!
</div>
```

## Shadows

```tsx
// Soft shadow
className="shadow-soft"    // 0 2px 8px rgba(0, 0, 0, 0.05)

// Card shadow
className="shadow-card"    // 0 4px 16px rgba(0, 0, 0, 0.08)

// Strong shadow
className="shadow-strong"  // 0 8px 32px rgba(0, 0, 0, 0.12)
```

## Border Radius

```tsx
className="rounded-xl"     // 0.75rem (12px)
className="rounded-2xl"    // 1rem (16px)
className="rounded-3xl"    // 1.5rem (24px)
```

## Spacing

Standard Tailwind spacing + custom:
```tsx
className="p-4"      // padding: 1rem
className="m-8"      // margin: 2rem
className="space-x-128"  // 32rem (custom)
className="space-y-144"  // 36rem (custom)
```

## Typography

Font family is configured to use Inter with fallbacks:
```tsx
className="font-sans"  // Inter, -apple-system, BlinkMacSystemFont, etc.
```

Font sizes:
```tsx
className="text-xs"    // 0.75rem
className="text-sm"    // 0.875rem
className="text-base"  // 1rem
className="text-lg"    // 1.125rem
className="text-xl"    // 1.25rem
className="text-2xl"   // 1.5rem
className="text-3xl"   // 1.875rem
className="text-4xl"   // 2.25rem
className="text-5xl"   // 3rem
```

## Best Practices

### DO's ✅
- **Always use predefined colors** from the palette
- **Use semantic colors** for their intended purpose (success for success states, error for errors)
- **Combine Tailwind classes** for custom needs: `bg-primary-600 hover:bg-primary-700`
- **Use gradient utilities** for backgrounds: `bg-gradient-primary`
- **Follow spacing scale** provided by Tailwind

### DON'Ts ❌
- **Don't use arbitrary colors**: ~~`bg-[#ff0000]`~~
- **Don't use inline styles**: ~~`style={{ background: '#667eea' }}`~~
- **Don't create custom CSS** when Tailwind classes exist
- **Don't mix color systems** (stick to the palette)
- **Don't use random shades** (use the predefined 50-950 scale)

## Conflict Prevention

To avoid style conflicts:

1. **Use the palette**: Always reference colors by their Tailwind names
2. **Check existing styles**: Before adding new utility classes, check if they already exist
3. **Avoid specificity wars**: Don't use `!important` unless absolutely necessary
4. **Use CSS layers**: Keep custom utilities in `@layer utilities`
5. **Document changes**: If you add new colors to `tailwind.config.js`, update this guide

## Migration from Inline Styles

**Before** (inline styles):
```tsx
<div style={{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '20px',
  borderRadius: '12px'
}}>
```

**After** (Tailwind):
```tsx
<div className="bg-gradient-primary p-5 rounded-xl">
```

## IDE Support

For better DX, install:
- **Tailwind CSS IntelliSense** (VS Code extension)
- **Prettier Plugin for Tailwind CSS** (sorts classes automatically)

## Questions?

Contact the frontend team lead or check `tailwind.config.js` for the complete configuration.

---

**Last Updated**: December 20, 2025  
**Version**: 1.0.0  
**Maintained by**: Frontend Team
