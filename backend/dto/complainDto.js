const { ok, fail, requiredString, requiredDate } = require('./validate');

const complainCreateDto = (body) => {
    const date = requiredDate(body, 'date', 'Date');
    if (date.error) return fail(date.error);
    const complaint = requiredString(body, 'complaint', 'Complaint');
    if (complaint.error) return fail(complaint.error);

    return ok({
        date: date.value,
        complaint: complaint.value,
    });
};

module.exports = { complainCreateDto };
