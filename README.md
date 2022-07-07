# NodeSpringClass-Preview
Node.js + Mongodb 

# Preparation
# add a file named ==".env"== and set the parameters, the example below
```
DATABASE = mongodb+srv://<username>:<password>@cluster0.ks5pg.mongodb.net/hotel?authSource=admin&replicaSet=atlas-pfbouq-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true
DATABASE_USERNAME = xxxxx
DATABASE_PASSWORD = xxxxx
SECRET = 'xxxxxxxx'
```

# Get Started
## Project setup
```
npm install
```

### Lints and fixes files with ESLint
```
npm run lint
```

### Compiles and start Server in Development
```
npm run start:dev
```

### Compiles and start Server in Production
```
npm run start:production
```

### Generate API doc in swagger-autogen Format
```
npm run swagger-autogen
```
