-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tasks table from scratch
CREATE TABLE IF NOT EXISTS public.tasks (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "completed" BOOLEAN DEFAULT false,
    "order" INTEGER,
    "createdAt" BIGINT,
    "date" BIGINT,
    "time" TEXT,
    "repeat" TEXT,
    "repeatInterval" INTEGER,
    "repeatEndDate" BIGINT,
    "repeatWeekDays" INTEGER[],
    "repeatMonthlyType" TEXT,
    "repeatMonthlyDay" TEXT,
    "repeatMonthlyWeekOccurrence" TEXT,
    "repeatMonthlyWeekDay" INTEGER,
    "repeatYearlyType" TEXT,
    "repeatYearlyMonth" INTEGER,
    "repeatYearlyDay" TEXT,
    "subtasks" JSONB
);

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can manage their own tasks"
    ON public.tasks FOR ALL
    USING (auth.uid() = "userId")
    WITH CHECK (auth.uid() = "userId");

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_tasks_userId ON public.tasks("userId");
CREATE INDEX IF NOT EXISTS idx_tasks_order ON public.tasks("order");
CREATE INDEX IF NOT EXISTS idx_tasks_date ON public.tasks("date");
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON public.tasks("completed");
CREATE INDEX IF NOT EXISTS idx_tasks_createdAt ON public.tasks("createdAt");
