FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
COPY tsconfig.json ./
COPY next.config.ts ./

# allow build-time vars
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_BASE_URL

# make them available for build step and runtime
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}

RUN npm ci
COPY . .

RUN npm run type-check

# Build application (now has NEXT_PUBLIC_* envs available)
RUN npm run build

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

CMD ["npm", "run", "start"]
