module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    ticker: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  },{
    timestamps: false
  });

  return Company;
};
