const fs = require('fs-extra')
const path = require('path');


const read_notice = async (req, res) => {
    try {
        const filePath = path.join(`${__dirname}/../../../src/notice/notice.txt`)
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (data) {
                res.status(200).json({ data: data })
                return;
            } else {
                res.status(200).json({ failed: "failed to read data, please try again." })
            }

        });
    } catch (error) {
        res.status(200).json({ failed: "failed to read data, please try again." })
    }
}

module.exports = read_notice;