import React, { useState } from 'react';
import './PhotoUpload.css';

function PhotoUpload({ onUploadComplete }) {
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        setPreview(URL.createObjectURL(file));
        setError(null);

        const formData = new FormData();
        formData.append('photo', file);

        try {
            setLoading(true);
            const response = await fetch('/api/upload-meal-photo', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            onUploadComplete(data.photoUrl);
        } catch (err) {
            setError('Failed to upload photo');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="photo-upload">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="file-input"
                id="meal-photo"
            />
            <label htmlFor="meal-photo" className="upload-label">
                {loading ? 'Uploading...' : 'Upload Meal Photo'}
            </label>

            {preview && (
                <div className="preview-container">
                    <img src={preview} alt="Preview" className="photo-preview" />
                </div>
            )}

            {error && <div className="upload-error">{error}</div>}
        </div>
    );
}

export default PhotoUpload;