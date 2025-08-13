# Project Overview

This is a React.js frontend application built with Vite. It serves as a user interface for managing various types of "solicitudes" (requests) and "feriados" (holidays/leaves). The application features modules for administrative tasks, departmental views, an inbox for requests, and a section for users to view their own requests. It leverages Bootstrap for UI components and styling, and `react-router-dom` for client-side navigation. The application interacts with a backend API, which is configured to run on `http://localhost:8082`.

# Building and Running

This project uses Vite as its build tool. The following `npm` scripts are available for development and production:

*   **`npm run dev`**: Starts the development server with hot module replacement. The application will typically be accessible at `http://localhost:5173` (or another port if 5173 is in use).
*   **`npm run build`**: Compiles and bundles the application for production. The optimized static assets will be placed in the `dist/` directory.
*   **`npm run lint`**: Runs ESLint to analyze the codebase for potential errors and enforce coding style guidelines.
*   **`npm run preview`**: Serves the production build locally for testing purposes.

# Development Conventions

*   **Component-based Architecture**: The application follows a component-based structure, with UI components organized within the `src/components` directory, further categorized by page or functionality.
*   **State Management**: React's Context API (`src/context`) is utilized for managing global application state, such as user information (`UsuarioContext`).
*   **API Communication**: All interactions with the backend API are handled through a dedicated service layer (`src/services`), using `axios` for HTTP requests.
*   **Routing**: `react-router-dom` is used for declarative routing within the single-page application.
*   **Styling**: Bootstrap CSS framework is used for responsive design and pre-built UI components.
*   **Code Quality**: ESLint is configured to maintain code quality and consistency across the project.
