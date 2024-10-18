# BraincellsMapping
Website for mapping Braincells Season 5

# To Do
- Fix pan and zoom
- Improve filter modal
- Adjust rendering to pixel based.
- Implement chunk claim rendering
- Implement data contribution/editing
- Implement data history control (git style)
- Implement admin section

# Contribution
Feel free to contribute to this project.  The gitignore is already setup for `/node_modules` and .env which is used for the database details (MariaDB).  Below is the example for the .env.  `database.sql` has the tables.


```
DB_HOST=localhost
DB_USER=minecraft_mapping
DB_PASSWORD=password123
DB_NAME=minecraft_mapping
DB_PORT=3306  # Default MariaDB port, change if needed
```

To test just run node app.js and go to localhost:3000