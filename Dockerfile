# ---------- build stage ----------
ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION} AS builder
WORKDIR /app

# copy package files first for better caching
COPY package*.json ./

# install all deps (devDeps required for building vuetify / sass / vite plugins)
RUN npm install

# copy rest of sources
COPY . .

# make sure .env is included
COPY .env .env


# build the nuxt app (this will produce .output)
RUN npm run build

# ---------- production stage ----------
FROM node:${NODE_VERSION}-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3002
ENV HUSKY=0 

# copy built output from builder
COPY --from=builder /app/.output ./.output

# copy package files to install production deps only
COPY --from=builder /app/package*.json ./

# install only production dependencies to keep image small
RUN npm install --omit=dev

EXPOSE 3002

# Start the Nuxt server produced in .output
CMD ["node", ".output/server/index.mjs"]
