const jwt = require("jsonwebtoken");
const Admin = require("../models/adminSchema.js");
const Student = require("../models/studentSchema.js");
const Teacher = require("../models/teacherSchema.js");
const { setAuthCookies, clearAuthCookies } = require("../utils/authCookies.js");

const stripPassword = (doc) => {
    if (!doc) return null;
    const obj = doc.toObject();
    delete obj.password;
    return obj;
};

const loadProfile = async (id, role) => {
    if (role === "Admin") {
        const admin = await Admin.findById(id);
        return stripPassword(admin);
    }
    if (role === "Teacher") {
        const teacher = await Teacher.findById(id)
            .populate("teachSubject", "subName sessions")
            .populate("school", "schoolName")
            .populate("teachSclass", "sclassName");
        return stripPassword(teacher);
    }
    if (role === "Student") {
        const student = await Student.findById(id)
            .populate("school", "schoolName")
            .populate("sclassName", "sclassName");
        if (!student) return null;
        const obj = stripPassword(student);
        delete obj.examResult;
        delete obj.attendance;
        return obj;
    }
    return null;
};

const me = async (req, res) => {
    try {
        const profile = await loadProfile(req.user.id, req.user.role);
        if (!profile) {
            clearAuthCookies(res);
            return res.status(401).json({ message: "Not authenticated" });
        }
        return res.json(profile);
    } catch (err) {
        return res.status(500).json({ message: "Could not load session" });
    }
};

const refresh = async (req, res) => {
    const token = req.cookies && req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
        );
        setAuthCookies(res, { _id: decoded.sub, role: decoded.role });
        return res.json({ success: true });
    } catch (err) {
        clearAuthCookies(res);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

const logout = async (req, res) => {
    clearAuthCookies(res);
    return res.json({ success: true, message: "Logged out" });
};

module.exports = { me, refresh, logout };
