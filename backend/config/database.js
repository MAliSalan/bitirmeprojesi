
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('yemeksepetison4', 'root', 'YBTYikilmaz12', {
    host: 'localhost',
    dialect: 'mysql',
});

sequelize.authenticate()
    .then(() => console.log('Veritabanına bağlantı başarılı'))
    .catch((err) => console.error('Veritabanına bağlanırken hata:', err));

module.exports = sequelize;