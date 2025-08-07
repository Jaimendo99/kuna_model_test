#!/bin/bash

# Setup script for the frontend
cd frontend

echo "Installing dependencies..."
npm install

echo "Starting development server..."
npm run dev
