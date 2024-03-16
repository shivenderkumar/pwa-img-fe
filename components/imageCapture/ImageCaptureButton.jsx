import axios from 'axios';
import { useState } from 'react';

export default function ImageCaptureButton() {
    const [capturedImage, setCapturedImage] = useState('');

    const captureImage = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        video.addEventListener('loadedmetadata', () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            setCapturedImage(canvas.toDataURL('image/png'));
            stream.getTracks().forEach(track => track.stop());
            canvas.toBlob(async (blob) => {
                const formData = new FormData();
                formData.append('image', blob, 'captured-image.png');
                try {
                    const response = await axios.post('http://localhost:5000/api/v1/report', formData);

                    if (response.status === 200) {
                        const blobData = new Blob([response.data], { type: 'application/pdf' });
                        const blobUrl = URL.createObjectURL(blobData);

                        window.open(blobUrl, '_blank');
                    } else {
                        console.error('Failed to capture image:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error capturing image:', error?.response);
                }

            }, 'image/png');
        });
    };

    return (
        <div>
            <button onClick={captureImage}>Capture Image</button>
            {capturedImage && <img src={capturedImage} alt="Captured Image" />}
        </div>
    );
}
