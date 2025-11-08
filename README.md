# Todo List Application

A modern, real-time todo list application built with Next.js and Supabase.

## Features

- **Add Todos** - Create new todos with keyboard shortcuts
- **Edit Todos** - Update existing todos inline
- **Delete Todos** - Remove todos you no longer need
- **Mark Complete** - Toggle completion status with strikethrough display
- **Filter Todos** - Search and filter todos in real-time
- **Real-time Sync** - Changes sync instantly across all devices
- **Persistent Storage** - All data stored in Supabase cloud database

## Tech Stack

- **Frontend**: Next.js 13 with App Router, React, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main todo list page
│   └── api/
│       └── todo/           # Todo API endpoints
├── components/
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── supabase.ts         # Supabase client setup
│   └── utils.ts            # Utility functions
└── supabase/
    └── migrations/         # Database migrations
```

## API Endpoints

- `GET /api/todo` - Fetch all todos
- `POST /api/todo` - Create a new todo
- `PUT /api/todo/[id]` - Update a todo
- `DELETE /api/todo/[id]` - Delete a todo

## Database Schema

The application uses a single `todos` table with the following structure:

- `id` (UUID) - Primary key
- `todo` (text) - Todo content
- `is_completed` (boolean) - Completion status
- `created_at` (timestamp) - Creation timestamp

## Building for Production

```bash
npm run build
npm start
```

## Deployment

The application is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy automatically on every push

## License

MIT
