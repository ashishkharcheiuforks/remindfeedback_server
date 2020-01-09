const express = require('express');
const { Board } = require('../../models');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares'); 
const {deleteS3Obj, upload_s3_test} = require('../uploads');

const router = express.Router();

let type = 'picture';
let fileSize = 50 * 1024 * 1024;

router.post('/create', isLoggedIn, upload_s3_test(type, fileSize).fields([{ name: 'file1' }, { name: 'file2' }, { name: 'file3' }]), async (req, res, next) => {
    try{
        const { feedback_id, board_title, board_content } = req.body;
        console.log(req.files)
        // req.files.map((v, i) => files[i] = v.key);
        console.log('게시물 사진 생성', feedback_id, board_title, board_content);
        let file1, file2, file3;
        if(req.files.file1)file1 = await req.files.file1[0].key;
        if(req.files.file2)file2 = await req.files.file2[0].key;
        if(req.files.file3)file3 = await req.files.file3[0].key;

        const exBoard = await Board.create({
            board_title,
            board_content,
            board_category: 1,
            fk_feedbackId: feedback_id,
            board_file1: file1,
            board_file2: file2,
            board_file3: file3,
        });
        let result = {
            success: true,
            data: '',
            message: '게시글 생성 완료',
        }
        if(exBoard) {
            result.data= exBoard
            res.status(201).json(result);
        }else {
            result.success = false;
            result.message = '게시글이 생성되지 않았습니다.';
            return res.status(201).json(result);
        }
    } catch(e){
        let result = {
            success: false,
            data: '',
            message: e
        }
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
});

router.put('/update/:board_id', isLoggedIn, upload_s3_test(type, fileSize).fields([{ name: 'file1' }, { name: 'file2' }, { name: 'file3' }]), async (req, res, next) => {
    try{
        const board_id = req.params.board_id;
        const { board_title, board_content, updatefile1, updatefile2, updatefile3 } = req.body; 
        console.log('board picture put 요청', board_title, board_content, updatefile1, updatefile2, updatefile3);
        const beforeBoard = await Board.findOne({
            where: {id:board_id},
        });
        let tempBoard = new Object();
        if(board_title || board_title !== beforeBoard.board_title){
            tempBoard.board_title = await board_title;
        }else{tempBoard.board_title = await beforeBoard.board_title;}

        if(board_content || board_content !== beforeBoard.board_content){
            tempBoard.board_content = await board_content;
        }else{tempBoard.board_content = await beforeBoard.board_content;}
        
        let deleteItems = [];
        tempBoard.board_file1 = await beforeBoard.board_file1;
        tempBoard.board_file2 = await beforeBoard.board_file2;
        tempBoard.board_file3 = await beforeBoard.board_file3;
        if(updatefile1){
            deleteItems.push({Key:beforeBoard.board_file1})
            if(req.files.file1)tempBoard.board_file1 = await req.files.file1[0].key
            else{tempBoard.board_file1 = null}
        }
        if(updatefile2){
            deleteItems.push({Key:beforeBoard.board_file2})
            if(req.files.file2)tempBoard.board_file2 = await req.files.file2[0].key
            else{tempBoard.board_file2 = null}
        }
        if(updatefile3){
            deleteItems.push({Key:beforeBoard.board_file3})
            if(req.files.file3)tempBoard.board_file3 = await req.files.file3[0].key
            else{tempBoard.board_file3 = null}
        }
        await deleteS3Obj(deleteItems);
        //업데이트
        await Board.update({
            board_title:tempBoard.board_title, board_content:tempBoard.board_content,
            board_file1: tempBoard.board_file1,
            board_file2: tempBoard.board_file2,
            board_file3: tempBoard.board_file3
        }, {where: {id:board_id}})
        //response
        const data = await Board.findOne({where:{id:board_id}})
        let result = {
            success: true,
            data,
            message: 'board picture update 성공'
        }
        res.status(200).json(result);
    } catch(e){
        let result = {
            success: false,
            data: '',
            message: e
        }
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
});

router.patch('/files/:board_id', isLoggedIn, upload_s3_test(type, fileSize).fields([{ name: 'file1' }, { name: 'file2' }, { name: 'file3' }]), async (req, res, next) => {
    try{
        const board_id = req.params.board_id;
        const { updatefile1, updatefile2, updatefile3 } = req.body; 
        console.log('board picture put 요청', board_id, updatefile1, updatefile2, updatefile3);
        const beforeBoard = await Board.findOne({
            where: {id:board_id},
        });
        let tempBoard = new Object();

        let deleteItems = [];
        tempBoard.board_file1 = await beforeBoard.board_file1;
        tempBoard.board_file2 = await beforeBoard.board_file2;
        tempBoard.board_file3 = await beforeBoard.board_file3;
        if(updatefile1){
            deleteItems.push({Key:beforeBoard.board_file1})
            if(req.files.file1)tempBoard.board_file1 = await req.files.file1[0].key
            else{tempBoard.board_file1 = null}
        }
        if(updatefile2){
            deleteItems.push({Key:beforeBoard.board_file2})
            if(req.files.file2)tempBoard.board_file2 = await req.files.file2[0].key
            else{tempBoard.board_file2 = null}
        }
        if(updatefile3){
            deleteItems.push({Key:beforeBoard.board_file3})
            if(req.files.file3)tempBoard.board_file3 = await req.files.file3[0].key
            else{tempBoard.board_file3 = null}
        }
        await deleteS3Obj(deleteItems);
        //업데이트
        await Board.update({
            board_file1: tempBoard.board_file1,
            board_file2: tempBoard.board_file2,
            board_file3: tempBoard.board_file3
        }, {where: {id:board_id}})
        //response
        const data = await Board.findOne({where:{id:board_id}})
        let result = {
            success: true,
            data,
            message: 'board picture update 성공'
        }
        res.status(200).json(result);
    } catch(e){
        let result = {
            success: false,
            data: '',
            message: e
        }
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
});

module.exports = router;
