import { useEffect, useMemo, useState } from 'react';
import { CircularProgress } from '@mui/material';
import Popup from '../../components/Popup';
import { addStuff } from '../../redux/userRelated/userHandle';
import { useDispatch, useSelector } from 'react-redux';
import SafeHtml from '../../components/SafeHtml';
import { COMPLAINT_MAX, sanitizeRichText } from '../../utils/sanitize';

const StudentComplain = () => {
    const [complaint, setComplaint] = useState("");
    const [date, setDate] = useState("");

    const dispatch = useDispatch()

    const { status, currentUser, error, tempDetails, response } = useSelector(state => state.user);

    const user = currentUser._id
    const school = currentUser.school._id
    const address = "Complain"

    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    // Member 3 — live preview. Unsafe HTML is stripped before the complaint is submitted.
    const complaintPreview = useMemo(() => sanitizeRichText(complaint), [complaint]);

    const fields = {
        user,
        date,
        complaint: complaintPreview.value,
        school,
    };

    const submitHandler = (event) => {
        event.preventDefault()
        if (!complaintPreview.value) {
            setMessage('Complaint is empty after removing unsafe HTML');
            setShowPopup(true);
            return;
        }
        setLoader(true)
        dispatch(addStuff(fields, address))
    };

    useEffect(() => {
        if (status === "added") {
            setLoader(false)
            setShowPopup(true)
            setMessage(
                tempDetails?.security?.xssDetected
                    ? "Unsafe HTML was stripped before this complaint was saved."
                    : "Done Successfully"
            )
            setComplaint("");
        }
        else if (status === "failed") {
            setLoader(false)
            setShowPopup(true)
            setMessage(response || "Could not add complaint")
        }
        else if (error) {
            setLoader(false)
            setShowPopup(true)
            setMessage("Network Error")
        }
    }, [status, error, tempDetails, response])

    return (
        <>
            <div className="complainPage">
                <form className="complainCard" onSubmit={submitHandler}>
                    <h1 className="complainCardTitle">Add Complaint</h1>

                    <div className="complainField">
                        <div className="complainFieldHead">
                            <label htmlFor="complain-date">Date</label>
                        </div>
                        <input
                            id="complain-date"
                            className="complainInput"
                            type="date"
                            value={date}
                            onChange={(event) => setDate(event.target.value)}
                            required
                        />
                    </div>

                    <div className="complainField">
                        <div className="complainFieldHead">
                            <label htmlFor="complain-text">Complaint</label>
                            <span className="complainCount">{complaint.length}/{COMPLAINT_MAX}</span>
                        </div>
                        <textarea
                            id="complain-text"
                            className="complainInput complainTextarea"
                            placeholder="Write your complaint..."
                            value={complaint}
                            maxLength={COMPLAINT_MAX}
                            onChange={(event) => setComplaint(event.target.value)}
                            required
                            rows={5}
                        />
                    </div>

                    <div className={`complainPreview ${complaintPreview.xssDetected ? 'complainPreviewWarn' : ''}`}>
                        <div className="complainPreviewHead">
                            <strong>Sanitized preview</strong>
                            {complaintPreview.xssDetected && <span className="complainBadge">Unsafe HTML detected</span>}
                        </div>
                        <p>
                            {complaintPreview.value
                                ? <SafeHtml html={complaintPreview.value} allowMarkup />
                                : '—'}
                        </p>
                    </div>

                    <button className="complainSubmit" type="submit" disabled={loader}>
                        {loader ? <CircularProgress size={22} color="inherit" /> : 'Add complaint'}
                    </button>
                </form>
            </div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default StudentComplain;
