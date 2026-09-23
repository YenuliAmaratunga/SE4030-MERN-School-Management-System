const Notice = require('../models/noticeSchema.js');
const { noticeCreateDto, noticeUpdateDto } = require('../dto/noticeDto');
const { sendValidationError } = require('../dto/validate');

const noticeCreate = async (req, res) => {
    try {
        const data = sendValidationError(res, noticeCreateDto(req.body));
        if (!data) return;

        const notice = new Notice({
            title: data.title,
            details: data.details,
            date: data.date,
            school: req.user.schoolId
        })
        const result = await notice.save()
        res.send(result)
    } catch (err) {
        res.status(500).json(err);
    }
};

const noticeList = async (req, res) => {
    try {
        let notices = await Notice.find({ school: req.params.id })
        if (notices.length > 0) {
            res.send(notices)
        } else {
            res.send({ message: "No notices found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateNotice = async (req, res) => {
    try {
        const data = sendValidationError(res, noticeUpdateDto(req.body));
        if (!data) return;

        const result = await Notice.findByIdAndUpdate(req.params.id,
            { $set: { title: data.title, details: data.details, date: data.date } },
            { new: true })
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteNotice = async (req, res) => {
    try {
        const result = await Notice.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteNotices = async (req, res) => {
    try {
        const result = await Notice.deleteMany({ school: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No notices found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

module.exports = { noticeCreate, noticeList, updateNotice, deleteNotice, deleteNotices };