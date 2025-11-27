# Frontend: Node 22
FROM node:22

WORKDIR /app

# Copiar solo package.json para cache
COPY package.json package-lock.json ./

RUN npm install

# Copiar código del frontend
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]
