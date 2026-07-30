# Frontend Bundle Builder

A React implementation of the Bundle Builder take-home assignment.

This project recreates the provided Figma design as a responsive multi-step bundle builder with a live review panel that updates in real time as the user configures their security system.

## Tech Stack

- React
- Context API
- Tailwind CSS
- JavaScript (ES6+)
- Local JSON
- LocalStorage

## Features

- Multi-step accordion bundle builder
- Data-driven UI powered by a local JSON file
- Reusable component architecture
- Product cards with:
  - Optional badges
  - Variant selection
  - Quantity steppers
  - Dynamic pricing
- Live review panel
- Quantity synchronization between product cards and review panel
- Dynamic total and savings calculations
- Responsive design
- Persist and restore the user's bundle using LocalStorage

## State Management

Application state is managed using **React Context API**, allowing all builder steps, product cards, and the review panel to stay synchronized from a single shared state.

## Project Structure

```
src/
├── assets/
├── components/
├── context/
├── data/
├── pages/
├── utils/
└── App.jsx
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/ELAZBAWY/Test_Front.git
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Design

The interface was implemented based on the provided Figma design with attention to layout, spacing, typography, and responsive behavior.

## Notes

- The UI is completely data-driven using a local JSON source.
- React Context API is used for centralized state management.
- Components are designed to be reusable and maintainable.
- LocalStorage is used to persist the user's saved configuration between sessions.

## Future Improvements

- Add automated unit and integration tests.
- Replace the local JSON source with a backend API.
- Improve accessibility (ARIA attributes and keyboard navigation).

## Live Demo

🔗 https://test-front-three-kappa.vercel.app/
