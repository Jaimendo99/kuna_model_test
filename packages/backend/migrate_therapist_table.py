#!/usr/bin/env python3
"""
Migration script to add new columns to the therapists table.
This script will safely add the new columns required for the enhanced therapist registration form.
"""

import sqlite3
import sys
import os
from datetime import datetime

# Database path
DB_PATH = "./therapist_matching.db"


def check_column_exists(cursor, table_name, column_name):
    """Check if a column exists in a table"""
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = [row[1] for row in cursor.fetchall()]
    return column_name in columns


def add_column_if_not_exists(cursor, table_name, column_name, column_type):
    """Add a column to a table if it doesn't exist"""
    if not check_column_exists(cursor, table_name, column_name):
        try:
            cursor.execute(
                f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type}")
            print(f"✓ Added column: {column_name}")
            return True
        except sqlite3.Error as e:
            print(f"✗ Error adding column {column_name}: {e}")
            return False
    else:
        print(f"→ Column {column_name} already exists")
        return True


def migrate_database():
    """Perform the database migration"""
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        print("Please make sure you're running this script from the correct directory.")
        return False

    print(f"Starting database migration for: {DB_PATH}")
    print(f"Timestamp: {datetime.now()}")
    print("-" * 50)

    try:
        # Connect to database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Backup the current table structure
        print("Creating backup of current table structure...")
        cursor.execute(
            "CREATE TABLE IF NOT EXISTS therapists_backup AS SELECT * FROM therapists WHERE 1=0")

        # List of new columns to add
        new_columns = [
            ("professional_titles", "TEXT"),
            ("professional_id_number", "TEXT"),
            ("hybrid", "BOOLEAN DEFAULT FALSE"),
            ("therapeutic_style", "TEXT"),  # Will store JSON
            ("age_groups", "TEXT"),  # Will store JSON
            ("weekly_availability", "TEXT"),
            ("commitment_level", "TEXT"),
            ("additional_info", "TEXT"),
        ]

        print("Adding new columns to therapists table:")
        all_successful = True

        for column_name, column_type in new_columns:
            success = add_column_if_not_exists(
                cursor, "therapists", column_name, column_type)
            if not success:
                all_successful = False

        if all_successful:
            # Commit the changes
            conn.commit()
            print("-" * 50)
            print("✓ Migration completed successfully!")

            # Verify the new structure
            print("\nUpdated table structure:")
            cursor.execute("PRAGMA table_info(therapists)")
            columns = cursor.fetchall()
            for col in columns:
                print(f"  - {col[1]} ({col[2]})")

        else:
            print("✗ Migration failed - rolling back changes")
            conn.rollback()
            return False

    except sqlite3.Error as e:
        print(f"✗ Database error: {e}")
        return False
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        return False
    finally:
        if conn:
            conn.close()

    return all_successful


def main():
    """Main function"""
    print("Therapist Table Migration Tool")
    print("=" * 50)

    success = migrate_database()

    if success:
        print("\n✓ Migration completed successfully!")
        print("The therapist registration form can now accept the new fields.")
        return 0
    else:
        print("\n✗ Migration failed!")
        print("Please check the error messages above and try again.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
