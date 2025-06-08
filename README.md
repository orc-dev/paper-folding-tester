# Paper Folding Tester





---
# Design Document

## THEME and SVG

### Theme Modes
- `BLACK_WHITE` (`'white'`):  
  Renders the paper in solid white, matching the background. This theme resembles the original PDF version of the test.

- `SOLID_COLOR` (`'solid'`):  
  Renders the paper in a light purple color, clearly distinguishing it from the background.

- `ALPHA_BLENDING` (`'alpha'`):  
  Renders the paper with semi-transparent color, allowing overlapping areas to appear darker and simulate layer stacking.


### SVG Element Specification
- All figures in this test are implemented using SVG elements.
- We define an imaginary **24 × 24 square** as the base coordinate system for the paper.
- Each **hole** is positioned using a pair of integers in this paper coordinate system.
- For each **Answer Option**, we use a list of hole positions to render the frame.
- For each **Question Frame**, we compose the SVG using the following parts:
  - `prePath`
  - `rect`
  - `poly`
  - `hole`
  - `postPath`


## DATA COLLECTION

### File Naming: `P000_FL_MMDD_HHMM.csv`
- We use JavaScript’s `new Date()` to get the **local time** based on the user’s device.
- `P000`: Participant ID (uppercase `P` + 3-digit number)
- `FL`: Initials of first and last name
- `MMDD`: Month and day of the test
- `HHMM`: Hour and minute when the test begins

### Meta Data


### Object Labels
- `QF1`–`QF5`: Question frames (top row), 1-indexed
- `AO1`–`AO5`: Answer options (bottom row), 1-indexed
- `BTN`: Continue button
- `NONE`: Any other area not covered by the above


### Object Coordinate System
- We define a custom coordinate system, called the **Object Coordinate**, which is independent of screen size, display resolution, and browser zoom level.
- The origin `(0, 0)` is set at the center of `AO3` (the third answer option).
- The unit length is defined as `1/96` of the side length of `AO3`.
- The X-axis increases from left to right, and the Y-axis increases from bottom to top.
- For each frame, the mouse position will be converted into this coordinate system for logging purposes.


### Sampling Policy
- `Maximum Sample Rate`: **1 sample every 100ms** (i.e., up to 10 frames per second).
- `Minimum Displacement Threshold`: **8 units** (in Object Coordinate).
- **Click events** are **ALWAYS** recorded, regardless of the above constraints, and reset the sampling timer.


###  CSV Header (Data Schema)
| **Column**      | **Description** |
|-----------------|-----------------|
| `PART_ID`       | The part number of the test (1 or 2) |
| `QUESTION_ID`   | The question index *within that part*, 1-indexed, up to 10 |
| `TIMESTAMP`     | Time when the event was recorded, in `hh:mm:ss.s` format (granularity: 0.1s) |
| `STEP`          | 0-indexed frame counter (per question) |
| `MOUSE_X`       | X coordinate in the **object coordinate system** |
| `MOUSE_Y`       | Y coordinate in the **object coordinate system** |
| `OBJ_HOVER_ON`  | The object currently under the mouse: `QF1` to `QF5`, `AO1` to `AO5`, `BTN`, or `NONE` |
| `N_CLICK`       | Number of clicks so far in this question; `-1` if this event is not a click |
|