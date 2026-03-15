# Quick Testing Guide

## Start Testing in 3 Steps

### Step 1: Start the Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

### Step 2: Open the Responsive Testing Tool
Open `test-responsive.html` in your browser to test different screen sizes interactively.

### Step 3: Test on Real Devices

#### For Mobile Device Testing:
1. Find your computer's local IP address:
   - **Windows**: Open Command Prompt and run `ipconfig`
   - **Mac/Linux**: Open Terminal and run `ifconfig` or `ip addr`
   - Look for your IPv4 address (e.g., 192.168.1.100)

2. Make sure your mobile device is on the same WiFi network

3. On your mobile device, open the browser and navigate to:
   ```
   http://[YOUR_IP_ADDRESS]:5173
   ```
   Example: `http://192.168.1.100:5173`

4. Test the following on your mobile device:
   - Tap the hamburger menu
   - Navigate through all pages
   - Complete the appointment booking flow
   - Rotate your device and verify layout adjusts
   - Test form inputs and validation

---

## Browser Testing Checklist

### Chrome
1. Open `http://localhost:5173` in Chrome
2. Press `F12` to open DevTools
3. Press `Ctrl+Shift+M` (or `Cmd+Shift+M` on Mac) for device toolbar
4. Test these widths: 320px, 375px, 768px, 1024px, 1440px, 2560px
5. Test all pages and functionality

### Firefox
1. Open `http://localhost:5173` in Firefox
2. Press `F12` to open DevTools
3. Press `Ctrl+Shift+M` (or `Cmd+Shift+M` on Mac) for responsive mode
4. Test various device presets
5. Verify all features work correctly

### Safari (Mac only)
1. Open `http://localhost:5173` in Safari
2. Enable Developer menu: Safari → Preferences → Advanced → Show Develop menu
3. Develop → Enter Responsive Design Mode
4. Test various device sizes
5. Pay special attention to date picker and form inputs

### Edge
1. Open `http://localhost:5173` in Edge
2. Press `F12` to open DevTools
3. Press `Ctrl+Shift+M` for device emulation
4. Test various screen sizes
5. Verify all features work correctly

---

## What to Test

### On Every Browser and Device:

#### Navigation
- [ ] Header displays correctly
- [ ] Navigation menu works (hamburger on mobile, horizontal on desktop)
- [ ] All links navigate correctly
- [ ] Active page is highlighted

#### Home Page
- [ ] Hero section displays correctly
- [ ] Services overview grid adjusts (1/2/3 columns)
- [ ] All buttons work
- [ ] Images load correctly

#### Services Page
- [ ] Service cards display correctly
- [ ] Expand/collapse works
- [ ] Grid layout adjusts to screen size
- [ ] Doctor information displays

#### About Page
- [ ] Content is readable
- [ ] Grid layouts adjust
- [ ] Images scale appropriately

#### Contact Page
- [ ] Contact information displays
- [ ] Links work (phone, email)
- [ ] Layout is responsive

#### Appointment Booking
- [ ] Step indicator displays correctly
- [ ] Department selection works
- [ ] Doctor selection works
- [ ] Date picker works (especially on mobile)
- [ ] Time slot selection works
- [ ] Form validation works
- [ ] Error messages display correctly
- [ ] Confirmation modal displays

#### General
- [ ] No horizontal scrolling
- [ ] All text is readable
- [ ] Touch targets are easy to tap (mobile)
- [ ] Hover states work (desktop)
- [ ] Focus indicators visible (keyboard navigation)
- [ ] Smooth transitions and animations

---

## Device Rotation Testing

### On Mobile Device:
1. Open the app in portrait mode
2. Navigate to different pages
3. Rotate to landscape
4. Verify:
   - Layout adjusts smoothly (within 500ms)
   - No content is cut off
   - All functionality still works
   - Navigation is still accessible
5. Rotate back to portrait
6. Verify layout returns correctly

---

## Performance Testing

### Using Chrome DevTools:
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Mobile" or "Desktop"
4. Click "Generate report"
5. Check scores for:
   - Performance (target: > 90)
   - Accessibility (target: > 90)
   - Best Practices (target: > 90)

### Network Throttling:
1. Open DevTools Network tab
2. Select throttling preset (e.g., "Slow 3G")
3. Reload page
4. Verify page loads within 3 seconds
5. Test appointment booking flow

---

## Common Issues to Watch For

### Safari/iOS
- Date input styling may differ
- Position: sticky behavior
- Viewport height (vh) with mobile Safari address bar

### Firefox
- Flexbox min-height behavior
- Scrollbar styling differences

### Mobile Devices
- Touch target sizes (minimum 44px)
- Keyboard covering form inputs
- Pinch-to-zoom behavior
- Smooth scrolling

---

## Reporting Issues

If you find any issues, document:
1. **Device/Browser**: e.g., "iPhone 14, Safari"
2. **Screen Size**: e.g., "390px width"
3. **Page**: e.g., "Appointment booking page"
4. **Issue**: Clear description of the problem
5. **Steps to Reproduce**: How to recreate the issue
6. **Expected**: What should happen
7. **Actual**: What actually happens
8. **Screenshot**: If possible

---

## Quick Reference: Breakpoints

- **Mobile**: < 768px (320px minimum)
- **Tablet**: 768px - 1023px
- **Desktop**: ≥ 1024px (up to 2560px)

---

## Automated Checks Already Completed ✅

- Build successful (no errors)
- No diagnostic errors in code
- Responsive hook implemented correctly
- CSS variables defined properly
- Media queries present in all components
- Touch targets meet 44px minimum
- Fluid typography implemented
- Grid layouts adapt correctly

---

## Next Steps After Testing

Once you've completed manual testing:
1. Check off items in `RESPONSIVE_TEST_CHECKLIST.md`
2. Document any issues found
3. Update `BROWSER_DEVICE_TEST_REPORT.md` with results
4. Mark task 17 as complete in `tasks.md`
