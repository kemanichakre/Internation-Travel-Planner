# Node base image
FROM node:20-alpine

# working directory
WORKDIR /app

# package files copy
COPY package*.json ./

# dependencies install
RUN npm install

# copy full project
COPY . .

# expose backend port (tumhara 5000 hai)
EXPOSE 5000

# start server
CMD ["npm", "run", "dev"]