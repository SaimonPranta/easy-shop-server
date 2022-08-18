const fs = require('fs-extra')
const path = require('path');


const add_notice = async (req, res) => {
    try {
        const noticeData = await req.body.notice ? req.body.notice : "  "
        const filePath = await path.join(`${__dirname}/../../../src/notice/notice.txt`)

        fs.writeFile(filePath, noticeData, err => {
            if (err) {
                res.status(200).json({ failed: "failed to write data, please try again." })
            } else {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (data) {
                        res.status(200).json({ data: data })
                        return;
                    } else {
                        res.status(200).json({ failed: "failed to read data, please try again." })
                        return;
                    }

                });
            }

        })


    } catch (error) {
        res.status(200).json({ failed: "failed to write data, please try again." })
    }
}

module.exports = add_notice;