FROM ghcr.io/puppeteer/puppeteer:22.9.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build

# Move the React build files to a location that can be served by the backend
RUN mv client/build /usr/src/app/build

# Expose the port that your app will run on
EXPOSE 3000

CMD [ "npm", "start" ]