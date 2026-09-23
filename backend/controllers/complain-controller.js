const Complain = require('../models/complainSchema.js');
const { complainCreateDto } = require('../dto/complainDto');
const { sendValidationError } = require('../dto/validate');

const complainCreate = async (req, res) => {
    try {
        const data = sendValidationError(res, complainCreateDto(req.body));
        if (!data) return;

        const complain = new Complain({
            date: data.date,
            complaint: data.complaint,
            user: req.user.id,
            school: req.user.schoolId
        })
        const result = await complain.save()
        res.send(result)
    } catch (err) {
        res.status(500).json(err);
    }
};

const complainList = async (req, res) => {
    try {
        let complains = await Complain.find({ school: req.params.id }).populate("user", "name");
        if (complains.length > 0) {
            res.send(complains)
        } else {
            res.send({ message: "No complains found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { complainCreate, complainList };
