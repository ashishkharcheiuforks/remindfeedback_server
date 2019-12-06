//feedback 테이블 정보 담기
module.exports = (sequelize, DataTypes) => (
    sequelize.define('feedback', {
        user_uid: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
        adviser_uid: {
            type: DataTypes.STRING,
            allowNull: true,
        }, 
        category: {
            type: DataTypes.INTEGER, 
            allowNull: true,
        }, 
        title: {
            type: DataTypes.STRING(100),
            allowNull: true, //카카오일시 필수가 아니어도되니 false
        }, 
        write_date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        timestamps: true, //생성일, 수정일 기록
        paranoid: true, //삭제일기록(복구용)
    })
);