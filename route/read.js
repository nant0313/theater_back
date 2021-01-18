const express = require('express');
const router = express.Router();
const mysql2 = require('mysql2');
const connection = mysql2.createPool({
    host: process.env.MYSQL2_HOST,
    user: process.env.MYSQL2_USER,
    password: process.env.MYSQL2_PW,
    database: process.env.MYSQL2_DB
});

router.use('/story', (req, res) => {
    connection.query(`SELECT * FROM story
    JOIN subCategory
    ON subCategory.mainCatIdx = story.mainCatIdx AND story.idx = ?
    JOIN mainCategory
    ON subCategory.subIdx = story.subCatIdx AND subCategory.mainCatIdx=mainCategory.mainIdx`, [req.body.id], (err, result, fields) => {
        if (err) console.log(err)
        else res.send(result[0]);
    })
})
router.use('/categories', (req, res) => {
    if (req.query.data === "sub") {
        connection.query(`SELECT * FROM subCategory 
		JOIN mainCategory
        ON (mainCategory.mainIdx = ? AND mainCategory.mainIdx = subCategory.mainCatIdx)`, [req.query.mainId], (err, result, fields) => {
            if (err) console.log(err);
            else res.json({
                subCategory: result
            })
        });
    } else if (req.query.data === "main") {
        connection.query(`SELECT * FROM mainCategory`, (err1, result1, fields1) => {
            if (err1) console.log(err1)
            else res.json({
                mainCategory: result1
            });
        });
    }
})
router.use('/comment', (req, res) => {
    connection.query(`
        SELECT * FROM comment
        LEFT JOIN subComment
        ON comment.storyId = ? AND subComment.commentId = comment.mainIdx
        WHERE comment.storyId = ?
    `, [req.body.id, req.body.id], (err, result, fields) => {
    connection.query(`
    SELECT ( SELECT COUNT(*) FROM comment WHERE storyId = ?) 
     + ( SELECT COUNT(*) FROM subComment WHERE storyId = ?) AS cnt 
    `, [req.body.id, req.body.id], (err1, result1, fields1) => {
            res.send({ comment: result, cnt: result1[0].cnt })
        })
    })
})
module.exports = router;
