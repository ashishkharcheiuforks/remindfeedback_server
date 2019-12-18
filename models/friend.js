//friend 테이블 정보 담기
/*
1. 0 -> pending_first_second : first가 second 에게 친구요청
2. 1 -> pending_second_first : second가 first 에게 친구요청
3. 2 -> friends : first와 second는 친구상태
4. 3 -> block_first_second : first가 second 를 차단함
5. 4 -> block_second_first : second가 first를 차단함
6. 5 -> block_both : first second 서로 차단함
*/
module.exports = (sequelize, DataTypes) => (
    sequelize.define('friend', {
        user_uid: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
        friend_uid: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
        type: {
            type: DataTypes.INTEGER, 
            allowNull: false,
        }
    }, {
        timestamps: true, //생성일, 수정일 기록
        paranoid: true, //삭제일기록(복구용)
    })
);