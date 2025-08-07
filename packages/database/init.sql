-- PostgreSQL initialization script for Kuna Therapist Matching
-- This script will be run when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The tables will be created automatically by SQLAlchemy
-- This file is here for any future manual database setup if needed

-- You can add initial data or additional configuration here
-- For example, create an admin user, set up indexes, etc.

-- Example: Create indexes for better performance
-- CREATE INDEX IF NOT EXISTS idx_therapists_email ON therapists(email);
-- CREATE INDEX IF NOT EXISTS idx_therapists_active ON therapists(is_active);
-- CREATE INDEX IF NOT EXISTS idx_model_comparisons_email ON model_comparisons(email);
-- CREATE INDEX IF NOT EXISTS idx_model_results_comparison ON model_results(comparison_id);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO kuna_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO kuna_user;
