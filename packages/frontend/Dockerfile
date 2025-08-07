# ---------- build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./          # package.json (and lock file if it appears)
# Use npm install when there is no lock-file
RUN npm install --include=dev

COPY . .
RUN npm run build


# ---------- runtime stage ----------
FROM nginx:alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80

# optional health-check
HEALTHCHECK CMD curl -f http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]