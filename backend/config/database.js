
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('databasetabloismi', 'root', 'databasesifresi', {
    host: 'localhost',
    dialect: 'mysql',
});

sequelize.authenticate()
    .then(() => console.log('Veritabanına bağlantı başarılı'))
    .catch((err) => console.error('Veritabanına bağlanırken hata:', err));

module.exports = sequelize;
