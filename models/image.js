const Sequelize = require('sequelize');

module.exports = class Image extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      path: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      index: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Image',
      tableName: 'images',
      paranoid: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Image.belongsToMany(db.Post, { through: 'PostImage' });
  }
};
