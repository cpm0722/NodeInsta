const Sequelize = require('sequelize');

module.exports = class Message extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            content: {
                type: Sequelize.STRING(300),
                allowNull: false,
            },
            sender: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' }
            },
            receiver: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' }
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Message',
            tableName: 'messages',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
    }
};
