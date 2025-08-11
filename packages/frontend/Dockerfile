# Dockerfile (frontend) — build-time VITE_API_URL support
FROM node:20-alpine AS builder
WORKDIR /app

# allow passing build-time value
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install --include=dev

COPY . .

# write production .env consumed by Vite during build
RUN echo "VITE_API_URL=$VITE_API_URL" > .env.production

RUN npm run build

FROM nginx:alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# ensure curl exists for healthcheck, or remove healthcheck here if not needed
RUN apk add --no-cache curl
HEALTHCHECK CMD curl -f http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]