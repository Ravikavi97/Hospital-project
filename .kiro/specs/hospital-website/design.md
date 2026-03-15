# Design Document

## Overview

The hospital website is a React-based single-page application (SPA) that provides an attractive, mobile-responsive interface for patients to access hospital information and book appointments. The application follows modern web design principles with a component-based architecture, responsive design patterns, and a clean, professional aesthetic suitable for healthcare services.

The design emphasizes accessibility, performance, and user experience across all device types, from mobile phones to desktop computers.

## Architecture

### Technology Stack

- **Frontend Framework**: React 18+ with functional components and hooks
- **Styling**: CSS Modules or Styled Components for component-scoped styling, with CSS Grid and Flexbox for layouts
- **Routing**: React Router for client-side navigation
- **State Management**: React Context API for global state (appointment booking flow, user data)
- **Form Handling**: React Hook Form for form validation and management
- **Responsive Design**: Mobile-first approach with CSS media queries
- **Build Tool**: Vite or Create React App for development and production builds

### Application Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Navigation/
│   │   └── Button/
│   ├── home/
│   │   ├── Hero/
│   │   ├── ServicesOverview/
│   │   └── CallToAction/
│   ├── services/
│   │   ├── ServicesList/
│   │   └── ServiceCard/
│   ├── appointment/
│   │   ├── AppointmentForm/
│   │   ├── DepartmentSelector/
│   │   ├── DoctorSelector/
│   │   ├── DateTimePicker/
│   │   └── ConfirmationModal/
│   └── about/
│       └── AboutSection/
├── pages/
│   ├── HomePage.jsx
│   ├── ServicesPage.jsx
│   ├── AppointmentPage.jsx
│   ├── AboutPage.jsx
│   └── ContactPage.jsx
├── context/
│   └── AppointmentContext.jsx
├── hooks/
│   └── useResponsive.js
├── utils/
│   └── validation.js
├── data/
│   └── mockData.js
├── styles/
│   ├── variables.css
│   └── global.css
├── App.jsx
└── main.jsx
```

## Components and Interfaces

### Core Layout Components

#### Header Component
- **Purpose**: Provides consistent branding and navigation across all pages
- **Props**: None (uses routing context)
- **Features**:
  - Hospital logo and name
  - Desktop navigation menu (horizontal)
  - Mobile hamburger menu (toggleable)
  - "Book Appointment" CTA button
  - Sticky positioning on scroll

#### Navigation Component
- **Purpose**: Handles routing between pages
- **Props**: `isMobile: boolean`, `isOpen: boolean`, `onClose: function`
- **Features**:
  - Links to Home, Services, About, Contact, Appointment
  - Active route highlighting
  - Smooth transitions
  - Accessible keyboard navigation

#### Footer Component
- **Purpose**: Displays hospital contact information and additional links
- **Props**: None
- **Features**:
  - Hospital address, phone, email
  - Operating hours
  - Social media links
  - Copyright information

### Home Page Components

#### Hero Component
- **Purpose**: Eye-catching introduction to the hospital
- **Props**: None
- **Features**:
  - Large background image or gradient
  - Hospital tagline and mission statement
  - Primary CTA button for appointment booking
  - Responsive text sizing

#### ServicesOverview Component
- **Purpose**: Quick preview of hospital departments
- **Props**: `services: Array<Service>`
- **Features**:
  - Grid layout of service cards (3 columns desktop, 2 tablet, 1 mobile)
  - Icons for each service
  - Brief descriptions
  - "Learn More" links

### Appointment Booking Components

#### AppointmentForm Component
- **Purpose**: Multi-step form for booking appointments
- **Props**: None (uses context)
- **State Management**: AppointmentContext
- **Features**:
  - Step indicator (Department → Doctor → Date/Time → Contact Info)
  - Progress bar
  - Back/Next navigation
  - Form validation
  - Responsive layout

#### DepartmentSelector Component
- **Purpose**: Allows patient to choose medical department
- **Props**: `departments: Array<Department>`, `onSelect: function`
- **Features**:
  - Card-based selection interface
  - Department icons and descriptions
  - Visual feedback on selection
  - Search/filter capability

#### DoctorSelector Component
- **Purpose**: Displays available doctors for selected department
- **Props**: `doctors: Array<Doctor>`, `department: string`, `onSelect: function`
- **Features**:
  - Doctor cards with photo, name, specialization
  - Availability indicators
  - Bio/credentials on hover or tap

#### DateTimePicker Component
- **Purpose**: Calendar interface for selecting appointment slot
- **Props**: `availableSlots: Array<Slot>`, `onSelect: function`
- **Features**:
  - Calendar view for date selection
  - Time slot grid for selected date
  - Disabled dates/times for unavailable slots
  - Next 30 days availability
  - Mobile-friendly touch interactions

#### ConfirmationModal Component
- **Purpose**: Displays booking confirmation
- **Props**: `appointmentDetails: Object`, `onClose: function`
- **Features**:
  - Summary of appointment details
  - Confirmation message
  - Download/print options
  - Close button

### Services Page Components

#### ServicesList Component
- **Purpose**: Comprehensive list of hospital services
- **Props**: `services: Array<Service>`
- **Features**:
  - Expandable service cards
  - Detailed descriptions
  - List of doctors per department
  - Operating hours per department

## Data Models

### Department
```javascript
{
  id: string,
  name: string,
  description: string,
  icon: string,
  operatingHours: {
    weekdays: string,
    weekends: string
  },
  doctors: Array<string> // doctor IDs
}
```

### Doctor
```javascript
{
  id: string,
  name: string,
  specialization: string,
  departmentId: string,
  photo: string,
  bio: string,
  availableSlots: Array<Slot>
}
```

### Appointment Slot
```javascript
{
  id: string,
  doctorId: string,
  date: string, // ISO format
  time: string, // HH:MM format
  available: boolean
}
```

### Appointment
```javascript
{
  id: string,
  patientName: string,
  patientEmail: string,
  patientPhone: string,
  departmentId: string,
  doctorId: string,
  slotId: string,
  date: string,
  time: string,
  status: 'pending' | 'confirmed' | 'cancelled'
}
```

## Responsive Design Strategy

### Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

### Mobile-First Approach
1. Design base styles for mobile (320px)
2. Add complexity with media queries for larger screens
3. Use CSS Grid and Flexbox for fluid layouts
4. Implement touch-friendly interactions (44px minimum tap targets)

### Responsive Patterns
- **Navigation**: Hamburger menu (mobile) → Horizontal menu (desktop)
- **Grid Layouts**: 1 column (mobile) → 2 columns (tablet) → 3-4 columns (desktop)
- **Typography**: Fluid font sizing using clamp() or viewport units
- **Images**: Responsive images with srcset for different resolutions
- **Forms**: Single column (mobile) → Multi-column (desktop)

### Custom Hook: useResponsive
```javascript
// Returns current breakpoint and device type
const { isMobile, isTablet, isDesktop } = useResponsive();
```

## Styling and Design System

### Color Palette
- **Primary**: Medical green (#10B981) - Health, vitality, growth
- **Secondary**: Deep green (#059669) - Trust, stability
- **Accent**: Light green (#34D399) - CTAs, highlights
- **Background**: White (#FFFFFF) - Clean, sterile, professional
- **Neutral**: Light grays (#F9FAFB, #F3F4F6, #E5E7EB) for subtle backgrounds
- **Text**: Dark gray (#1F2937) for primary text, medium gray (#6B7280) for secondary
- **Success**: Green (#10B981)
- **Error**: Red (#DC3545)

### Typography
- **Headings**: Sans-serif (e.g., Inter, Poppins) - Modern, clean
- **Body**: Sans-serif (e.g., Open Sans, Roboto) - Readable
- **Font Sizes**: 
  - H1: 2.5rem (mobile) → 3.5rem (desktop)
  - H2: 2rem (mobile) → 2.75rem (desktop)
  - Body: 1rem (16px base)
  - Small: 0.875rem

### Spacing System
- Base unit: 8px
- Scale: 4px, 8px, 16px, 24px, 32px, 48px, 64px

### Component Styling Patterns
- Card components: White background, subtle shadow, rounded corners (8px)
- Buttons: Rounded (4px), padding (12px 24px), hover states
- Form inputs: Border (1px solid), focus states with primary color
- Transitions: 200-300ms ease-in-out for smooth interactions

## Error Handling

### Form Validation Errors
- Display inline error messages below invalid fields
- Red border on invalid inputs
- Prevent form submission until all errors resolved
- Clear, actionable error messages

### Network Errors
- Display toast notifications for failed API calls
- Retry mechanisms for transient failures
- Graceful degradation if services unavailable
- Loading states during async operations

### User Feedback
- Loading spinners during data fetching
- Success messages after successful actions
- Confirmation dialogs for destructive actions
- Disabled states for unavailable options

## Testing Strategy

### Component Testing
- Unit tests for individual components using React Testing Library
- Test user interactions (clicks, form inputs)
- Test responsive behavior with different viewport sizes
- Test accessibility (ARIA labels, keyboard navigation)

### Integration Testing
- Test complete user flows (appointment booking end-to-end)
- Test navigation between pages
- Test form submission and validation
- Test context state management

### Responsive Testing
- Test on actual devices (iOS, Android)
- Test on different browsers (Chrome, Firefox, Safari, Edge)
- Test different screen sizes using browser dev tools
- Test touch interactions on mobile devices

### Accessibility Testing
- Keyboard navigation testing
- Screen reader compatibility
- Color contrast validation (WCAG AA standards)
- Focus management testing

## Performance Considerations

### Optimization Strategies
- Code splitting by route for faster initial load
- Lazy loading for images and non-critical components
- Memoization of expensive computations
- Debouncing for search/filter inputs
- Optimized images (WebP format, appropriate sizes)

### Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Performance Score: > 90

## Accessibility

### WCAG 2.1 AA Compliance
- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Sufficient color contrast ratios (4.5:1 for text)
- Focus indicators on all interactive elements
- Alt text for all images
- Form labels and error associations

## Future Enhancements

- User authentication for patient portal
- Appointment rescheduling and cancellation
- Integration with hospital management system
- Real-time availability updates
- Email/SMS notifications
- Multi-language support
- Telemedicine integration
