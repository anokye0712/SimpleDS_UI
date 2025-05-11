# Akua UI 8

Akua UI 8 is a modern, responsive, and feature-rich web application built with React, TypeScript, and Tailwind CSS. This project is designed to provide a seamless user experience with a focus on modularity, scalability, and maintainability.

## Features

- **Chat Interface**: Includes components for chat input, messages, and context display.
- **Customizable Layout**: Modular layout components like Header and Sidebar.
- **UI Components**: A library of reusable UI components such as buttons, inputs, scroll areas, separators, switches, toasts, and tooltips.
- **Settings Management**: A settings dialog for user preferences.
- **State Management**: Centralized state management using `chatStore` and `settingsStore`.
- **API Integration**: Services for API communication.
- **Utility Functions**: Helper functions for common tasks.

## Technologies Used

- **React**: For building the user interface.
- **TypeScript**: For type-safe development.
- **Tailwind CSS**: For styling.
- **Vite**: For fast development and build tooling.

## Project Structure

The project is organized as follows:

```
project/
├── src/
│   ├── components/       # Reusable UI and feature components
│   │   ├── chat/         # Chat-related components
│   │   ├── layout/       # Layout components
│   │   └── settings/     # Settings dialog
│   ├── lib/              # Utility functions
│   ├── services/         # API services
│   ├── store/            # State management
│   └── types/            # TypeScript type definitions
├── index.html            # Main HTML file
├── package.json          # Project dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (>= 16.x)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/akua-ui-8.git
   ```
2. Navigate to the project directory:
   ```bash
   cd akua-ui-8
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development

Start the development server:
```bash
npm run dev
# or
yarn dev
```

### Build

Build the project for production:
```bash
npm run build
# or
yarn build
```

### Linting

Run the linter:
```bash
npm run lint
# or
yarn lint
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.