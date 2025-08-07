# ---------- build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

# package.json (and lock file if it appears)
COPY package*.json ./
# Use npm install when there is no lock-file
RUN npm install --include=dev

COPY . .
RUN npm run build

COPY .env ./


# ---------- runtime stage ----------
FROM nginx:alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html
# COPY the custom nginx.conf into the Nginx default config location
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# optional health-check
HEALTHCHECK CMD curl -f http://localhost/health || exit 1 # Keep this if nginx.conf has /health
CMD ["nginx", "-g", "daemon off;"]
