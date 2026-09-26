import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { CircularProgress } from '@mui/material';
import Popup from '../../../components/Popup';
import SafeHtml from '../../../components/SafeHtml';
import {
  NOTICE_DETAILS_MAX,
  NOTICE_TITLE_MAX,
  sanitizePlainText,
  sanitizeRichText,
} from '../../../utils/sanitize';

const AddNotice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, response, error, tempDetails } = useSelector(state => state.user);
  const { currentUser } = useSelector(state => state.user);

  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState('');
  const adminID = currentUser._id

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  // Member 3 — live preview. Title is plain text. Details may keep bold, italic, and underline.
  const titlePreview = useMemo(() => sanitizePlainText(title), [title]);
  const detailsPreview = useMemo(() => sanitizeRichText(details), [details]);
  const xssDetected = titlePreview.xssDetected || detailsPreview.xssDetected;

  const fields = {
    title: titlePreview.value,
    details: detailsPreview.value,
    date,
    adminID,
  };
  const address = "Notice"

  const submitHandler = (event) => {
    event.preventDefault();
    if (!titlePreview.value || !detailsPreview.value) {
      setMessage('Notice content is empty after removing unsafe HTML');
      setShowPopup(true);
      return;
    }
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === 'added') {
      if (tempDetails?.security?.xssDetected) {
        setMessage('Unsafe HTML was stripped before this notice was saved.');
        setShowPopup(true);
      }
      const timer = setTimeout(() => {
        navigate('/Admin/notices');
        dispatch(underControl());
      }, tempDetails?.security?.xssDetected ? 1800 : 0);
      return () => clearTimeout(timer);
    } else if (status === 'failed') {
      setMessage(response || 'Could not add notice');
      setShowPopup(true);
      setLoader(false);
    } else if (status === 'error') {
      setMessage("Network Error")
      setShowPopup(true)
      setLoader(false)
    }
  }, [status, navigate, error, response, dispatch, tempDetails]);

  return (
    <>
      <div className="noticePage">
        <form className="noticeCard" onSubmit={submitHandler}>
          <h1 className="noticeCardTitle">Add Notice</h1>

          <div className="noticeField">
            <div className="noticeFieldHead">
              <label htmlFor="notice-title">Title</label>
              <span className="noticeCount">{title.length}/{NOTICE_TITLE_MAX}</span>
            </div>
            <input
              id="notice-title"
              className="noticeInput"
              type="text"
              placeholder="Enter notice title..."
              value={title}
              maxLength={NOTICE_TITLE_MAX}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="noticeField">
            <div className="noticeFieldHead">
              <label htmlFor="notice-details">Details</label>
              <span className="noticeCount">{details.length}/{NOTICE_DETAILS_MAX}</span>
            </div>
            <textarea
              id="notice-details"
              className="noticeInput noticeTextarea"
              placeholder="Enter notice details..."
              value={details}
              maxLength={NOTICE_DETAILS_MAX}
              onChange={(event) => setDetails(event.target.value)}
              required
              rows={5}
            />
          </div>

          <div className={`noticePreview ${xssDetected ? 'noticePreviewWarn' : ''}`}>
            <div className="noticePreviewHead">
              <strong>Sanitized preview</strong>
              {xssDetected && <span className="noticeBadge">Unsafe HTML detected</span>}
            </div>
            <p><span>Title:</span> {titlePreview.value || '—'}</p>
            <p>
              <span>Details:</span>{' '}
              {detailsPreview.value ? <SafeHtml html={detailsPreview.value} allowMarkup /> : '—'}
            </p>
          </div>

          <div className="noticeField">
            <div className="noticeFieldHead">
              <label htmlFor="notice-date">Date</label>
            </div>
            <input
              id="notice-date"
              className="noticeInput"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </div>

          <button className="noticeSubmit" type="submit" disabled={loader}>
            {loader ? <CircularProgress size={22} color="inherit" /> : 'Add notice'}
          </button>
        </form>
      </div>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default AddNotice;
