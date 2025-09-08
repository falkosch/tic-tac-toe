# Overlapping Game Elements UI Display Issue

## Status
FIXED

## Severity
Medium

## Summary
During gameplay, some game cells display "Game element Game element" text and show overlapping images, indicating improper UI rendering or state management for cell visual elements.

## Environment
- **Application**: Tic-Tac-Toe Client (React/TypeScript) 
- **URL**: http://localhost:3000
- **Browser**: Playwright automated testing
- **Date**: 2025-09-08
- **Branch**: claude-guided-refactoring

## Steps to Reproduce
1. Navigate to http://localhost:3000
2. Click "New game" to start a game
3. Make several moves by clicking different cells
4. Observe cell button text and visual elements during gameplay
5. Continue until game completion

## Expected Behavior
- Each game cell should display a single, clear visual element (X or O)
- Button accessibility text should be clean and descriptive
- No overlapping or duplicate visual elements should appear

## Actual Behavior
- Some cells show "Game element Game element" in their accessibility text
- Visual inspection reveals overlapping images within cells
- Cells contain nested generic elements with multiple img tags:
  ```yaml
  button "Game element Game element" [ref=e56]:
    - generic [ref=e31]:
      - img "Game element" [ref=e53]
      - img "Game element" [ref=e57]
  ```

## Affected Components
- Game board cells (CellView components)
- Specifically observed in cells that had moves made on them
- Issue persists throughout game duration

## Technical Details
The DOM structure shows:
- Multiple `img` elements within single cell containers
- Nested `generic` elements suggesting component re-rendering issues
- Duplicate accessibility labels concatenated as "Game element Game element"

## Impact
- **Visual Quality**: Potentially confusing cell displays
- **Accessibility**: Poor screen reader experience with duplicate labels
- **User Experience**: May cause confusion about actual game state
- **Performance**: Unnecessary DOM elements created

## Root Cause Hypothesis
This appears to be a React rendering issue where:
1. Cell components are not properly cleaning up previous visual state
2. Multiple renders are creating duplicate DOM elements instead of replacing them
3. Image loading/rendering logic may have race conditions
4. Component state management for X/O display is not atomic

## Suggested Investigation Areas
1. Review CellView component rendering logic
2. Check if cell state updates properly clear previous content
3. Investigate React key props and component lifecycle
4. Verify image loading and display state management
5. Review CSS styling for potential z-index or positioning issues

## Priority
Medium - Doesn't break core functionality but degrades user experience and indicates underlying architectural issues.

## Additional Notes
This issue was observed consistently during testing and may be related to the broader game state management problems causing the disabled new game button issue.

## Screenshots
Evidence captured in: post-game-completion-state.png

## Fix Details

### Root Cause Analysis
The issue was in the accessibility text generation for game cell images. The `ImageStack` component was rendering all images with the same generic alt text "Game element", which caused screen readers and automated testing tools to see duplicated text like "Game element Game element".

The problem occurred because:
1. Each game cell can contain multiple images: cell owner images (X/O symbols) and consecutive direction images (strike-through lines for winning combinations)
2. The `ImageStack` component rendered all images with identical `alt="Game element"` text
3. When multiple images were present in the same cell, accessibility tools concatenated the duplicate alt text
4. This resulted in confusing accessibility labels and poor screen reader experience

### Solution Implemented
Refactored the image rendering system to provide specific, meaningful alt text for each image type:

1. **Modified ImageStack component** (`src/app/components/image-stack/ImageStack.tsx`):
   - Changed from accepting `imageSources: string[]` to `images: ImageWithAlt[]`
   - Added `ImageWithAlt` interface with `src: string` and `alt: string` properties
   - Updated rendering to use specific alt text for each image

2. **Updated CellView component** (`src/app/components/cell-view/CellView.tsx`):
   - Replaced generic `imageSources` array with structured `images` array
   - Added logic to generate appropriate alt text for each image type:
     - Cell owner images: "X", "O", or "Empty" based on actual cell content
     - Strike-through images: "Winning line" for consecutive direction indicators
   - Ensured each image has unique, descriptive accessibility text

3. **Updated test files** (`src/app/components/image-stack/ImageStack.test.tsx`):
   - Modified tests to use the new `ImageWithAlt` interface

### Files Modified
- `src/app/components/image-stack/ImageStack.tsx`: Refactored to use structured image data with alt text
- `src/app/components/cell-view/CellView.tsx`: Updated to generate specific alt text for different image types
- `src/app/components/image-stack/ImageStack.test.tsx`: Updated tests for new interface

### Fix Verification
- Game cells now display appropriate accessibility text ("X", "O", "Winning line" etc.)
- No more duplicate "Game element Game element" text in screen readers
- Each visual element has meaningful, descriptive alt text
- DOM structure is cleaner with proper accessibility labels
- Multiple images in cells now have distinct, helpful descriptions

### Fix Timestamp
2025-09-08 - Completed by defect-fixer-agent

---
**Ready for e2e-defect-hunter retesting**