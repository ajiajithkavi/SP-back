# demo admin user credentials

# Main Admin	    admin@example.com	    admin123
# Ecommerce Admin	ecommerce@example.com	admin123
# Grocery Admin	    grocery@example.com	    admin123
# Taxi Admin	    taxi@example.com	    admin123
# Hotel Admin	    hotel@example.com	    admin123

# To install dependencies
npm install

# To drop a db
npx sequelize-cli db:drop

# To create a db
npx sequelize-cli db:create

# To migrate a db
npx sequelize-cli db:migrate

# To populate with demo data
npx sequelize-cli db:seed:all

# TO start the server
npm start