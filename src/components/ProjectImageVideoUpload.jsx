import React, { useState, useRef } from 'react';
import { Upload, Trash2, CheckCircle, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageCropper from "./ImageCropper"

const ProjectImageVideoUpload = ({
  label = 'Upload Media',
  description = 'Upload images or videos supporting multiple aspect ratios.',
  ratios = [
    { label: '16:9', ratio: 16 / 9, width: 200, height: 112 },
    { label: '9:16', ratio: 9 / 16, width: 120, height: 213 },
    { label: '1:1', ratio: 1, width: 150, height: 150 },
    { label: '3:2', ratio: 3 / 2, width: 180, height: 120 }
  ],
  onImagesChange = () => {},
  enableCropping = true,
  initialImages = [],
  onContinue = null,
  showAsModal = false,
  onClose = () => {},
  includeInvalidRatios = false,
  selectedRatioProp = [],
  allowVideos = true
}) => {
  const [uploadedImages, setUploadedImages] = useState(initialImages);
  const [selectedRatio, setSelectedRatio] = useState(null);
  const [cropperImage, setCropperImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [fileType, setFileType] = useState('image'); // 'image' or 'video'
  const fileInputRef = useRef(null);

  const handleRatioClick = (ratio, type = 'image') => {
    setSelectedRatio(ratio);
    setFileType(type);
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (!files || files.length === 0) return;

    // Process each file
    files.forEach((file, index) => {
      // Validate file type
      const isImage = file.type.startsWith('image/');
      const isVideo = allowVideos && file.type.startsWith('video/');
      
      if (!isImage && !isVideo) {
        toast.error(`File "${file.name}" is not a valid image or video file`);
        return;
      }

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (isImage && fileSizeMB > 5) {
        toast.error(`Image "${file.name}" size must be less than 5MB`);
        return;
      }
      if (isVideo && fileSizeMB > 50) {
        toast.error(`Video "${file.name}" size must be less than 50MB`);
        return;
      }

      if (isVideo) {
        // For videos, skip cropping and add directly
        const videoUrl = URL.createObjectURL(file);
        const newVideo = {
          id: Date.now() + index, // Ensure unique IDs for multiple files
          name: file.name,
          file,
          size: fileSizeMB,
          ratio: selectedRatio?.label || 'auto',
          isValidRatio: true,
          uploadTime: new Date().toLocaleTimeString(),
          preview: videoUrl,
          type: 'video'
        };

        setUploadedImages(prev => {
          const updated = [...prev, newVideo];
          onImagesChange(updated);
          return updated;
        });
      } else {
        // For images, proceed with cropping flow
        const reader = new FileReader();
        reader.onload = (e) => {
          if (enableCropping && selectedRatio) {
            // For multiple files, we'll process them one by one through the cropper
            setCropperImage({
              file,
              dataURL: e.target.result,
              targetRatio: selectedRatio,
              isMultiple: files.length > 1,
              currentIndex: index,
              totalFiles: files.length
            });
            setShowCropper(true);
          } else {
            // If cropping is disabled or no specific ratio selected, add directly
            handleCropComplete({ base64: e.target.result, file });
          }
        };
        reader.readAsDataURL(file);
      }
    });

    event.target.value = '';
  };

  const handleCropComplete = (result) => {
    if (!result) {
      setShowCropper(false);
      setCropperImage(null);
      setSelectedRatio(null);
      return;
    }

    const { base64, file } = result;
    const img = new Image();
    img.onload = () => {
      const actualRatio = img.width / img.height;
      const targetRatio = selectedRatio?.ratio;
      const isValidRatio = !targetRatio || Math.abs(actualRatio - targetRatio) < 0.1;
      const detectedRatio = ratios.find(r => Math.abs(actualRatio - r.ratio) < 0.1)?.label || actualRatio.toFixed(2);

      if (targetRatio && !isValidRatio) {
        toast.error(
          `Invalid image ratio. Detected: ${detectedRatio}, Expected: ${selectedRatio.label}`
        );
      }

      const newImage = {
        id: Date.now(),
        name: file.name,
        file, // Ensure the actual File object is preserved
        size: file.size / (1024 * 1024), // MB
        ratio: selectedRatio?.label || detectedRatio,
        isValidRatio,
        uploadTime: new Date().toLocaleTimeString(),
        preview: base64,
        type: 'image'
      };

      const updated = [...uploadedImages, newImage];
      setUploadedImages(updated);
      onImagesChange(updated);
      setShowCropper(false);
      setCropperImage(null);
      setSelectedRatio(null);
    };
    img.src = base64;
  };

  const handleRemoveImage = (id) => {
    const updated = uploadedImages.filter(img => img.id !== id);
    setUploadedImages(updated);
    onImagesChange(updated);
  };

  // Filter ratios to display based on selectedRatioProp
  const displayedRatios = selectedRatioProp.length > 0
    ? ratios.filter(ratio => selectedRatioProp.includes(ratio.label))
    : ratios;

  // Filter images to display based on selectedRatioProp
  const displayedImages = selectedRatioProp.length > 0
    ? uploadedImages.filter(img => selectedRatioProp.includes(img.ratio))
    : uploadedImages;

  // Determine which ratios have valid uploaded images
  const uploadedRatios = new Set(
    uploadedImages.filter(img => img.isValidRatio).map(img => img.ratio)
  );

  // Check if all required ratios have valid media
  const areAllRatiosUploaded = selectedRatioProp.length > 0 &&
    selectedRatioProp.every(ratio => uploadedRatios.has(ratio));

  // Find missing ratios
  const missingRatios = selectedRatioProp.filter(ratio => !uploadedRatios.has(ratio));
  const validUploadedImages = selectedRatioProp.length > 0
    ? uploadedImages.filter(
      (img) => selectedRatioProp.includes(img.ratio) && img.isValidRatio
    )
    : includeInvalidRatios
      ? uploadedImages
      : uploadedImages.filter((img) => img.isValidRatio);

  // Count and plural label
  const mediaCount = validUploadedImages.length;
  const pluralSuffix = mediaCount !== 1 ? 's' : '';

  const renderMediaPreview = (media) => {
    if (media.type === 'video') {
      return (
        <video
          controls
          style={{ maxWidth: '100%', maxHeight: '100%' }}
          className="img-fluid rounded"
        >
          <source src={media.preview} type={`video/${media.file.type.split('/').pop()}`} />
          Your browser does not support the video tag.
        </video>
      );
    }
    return (
      <img
        src={media.preview}
        alt={media.name}
        style={{ maxWidth: '100%', maxHeight: '100%' }}
        className="img-fluid rounded"
      />
    );
  };

  const renderRatioCard = (ratio) => {
    const isValidUploaded = uploadedRatios.has(ratio.label);
    
    return (
      <div key={ratio.label} className="ratio-card">
        <div
          className={`ratio-upload-area ${isValidUploaded ? 'has-upload' : ''}`}
          style={{
            width: ratio.width,
            height: ratio.height,
            aspectRatio: ratio.ratio,
            position: 'relative'
          }}
        >
          <div
            className="upload-placeholder"
            onClick={() => handleRatioClick(ratio, 'image')}
            title="Click to upload multiple images"
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <Upload size={24} />
              <span style={{ fontSize: '10px', textAlign: 'center' }}>
                {isValidUploaded ? 'Add More' : 'Upload'}
              </span>
            </div>
          </div>
          {allowVideos && (
            <div
              className="video-upload-area"
              onClick={() => handleRatioClick(ratio, 'video')}
              title="Click to upload videos"
              style={{ position: 'absolute', top: '4px', right: '4px' }}
            >
              {/* <Video size={16} /> */}
            </div>
          )}
          {isValidUploaded && (
            <div
              style={{
                position: 'absolute',
                top: '4px',
                left: '4px',
                background: 'rgba(34, 197, 94, 0.9)',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {uploadedImages.filter(img => img.ratio === ratio.label && img.isValidRatio).length}
            </div>
          )}
        </div>
        <div className="ratio-label">{ratio.label}</div>
      </div>
    );
  };

  const modalContent = (
    <div className="project-banner-upload">
      <div className="upload-header">
        <h2>{label}</h2>
        <p>{description}</p>
        <div style={{ marginTop: '16px' }}>
          <button
            type="button"
            className="bulk-upload-btn"
            onClick={() => {
              setSelectedRatio(null); // Allow any ratio for bulk upload
              fileInputRef.current?.click();
            }}
          >
            📎 Select Multiple Files
          </button>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
            Select multiple images at once - each will be processed individually for the selected ratio
          </p>
        </div>
      </div>

      <div className="ratio-grid">
        {displayedRatios.map(renderRatioCard)}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept={allowVideos ? "image/*,video/*" : "image/*"}
        onChange={handleFileSelect}
        multiple
        style={{ display: 'none' }}
      />

      {showCropper && cropperImage && (
        <ImageCropper
          open={showCropper}
          image={cropperImage.dataURL}
          originalFile={cropperImage.file}
          onComplete={handleCropComplete}
          selectedRatio={cropperImage.targetRatio}
          isMultiple={cropperImage.isMultiple}
          currentIndex={cropperImage.currentIndex}
          totalFiles={cropperImage.totalFiles}
        />
      )}

      {displayedImages.length > 0 && (
        <>
          <div className="section-divider" />
          <div className="uploaded-section">
            <h3>Uploaded Media</h3>
            <div className="uploaded-images">
              {displayedImages.map((media) => (
                <div
                  key={media.id}
                  className={`uploaded-image-card ${!media.isValidRatio ? 'invalid' : 'valid'}`}
                >
                  <div className="image-preview">
                    {renderMediaPreview(media)}
                  </div>
                  <div className="image-info">
                    <div className="image-name">
                      {media.name}
                      {media.isValidRatio && <CheckCircle size={16} className="valid-tick" />}
                      {media.type === 'video' && (
                        <span className="media-type-badge">Video</span>
                      )}
                    </div>
                    <div className="image-details">
                      <span className="image-ratio">{media.ratio}</span>
                      <span className="image-size">{media.size.toFixed(2)} MB</span>
                      {!media.isValidRatio && (
                        <span className="invalid-badge">Invalid Ratio</span>
                      )}
                    </div>
                    <div className="upload-time">Uploaded {media.uploadTime}</div>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveImage(media.id)}
                    aria-label="Remove media"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="continue-section">
              <button
                className="continue-btn"
                onClick={() => {
                  // Pass the images with their ratio information
                  const imagesByRatio = validUploadedImages.map(img => ({
                    file: img,
                    ratio: img.ratio
                  }));
                  onContinue(imagesByRatio);
                }}
              >
                Continue ({mediaCount} media{pluralSuffix} uploaded)
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );


  console.log('validUploadedImages:', validUploadedImages)
  // Extract only valid uploaded images based on the selected ratio prop



  return showAsModal ? (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>
        {modalContent}
        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            border-radius: 8px;
            max-width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            padding: 20px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          }

          .modal-close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #374151;
          }

          .modal-close-btn:hover {
            color: #ef4444;
          }

          .project-banner-upload {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          .upload-header {
            margin-bottom: 30px;
          }

          .upload-header h2 {
            font-size: 24px;
            font-weight: 600;
            color: #333;
            margin: 0 0 8px 0;
          }

          .upload-header p {
            color: #666;
            margin: 0;
            font-size: 14px;
          }

          .ratio-grid {
            display: flex;
            gap: 30px;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 40px;
            padding: 40px 20px;
            background: #f8f9fa;
            border-radius: 8px;
          }

          .ratio-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            cursor: pointer;
          }

          .ratio-upload-area {
            border: 2px dashed #d1d5db;
            border-radius: 8px;
            background: white;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
          }

          .ratio-upload-area:hover {
            border-color: #5e2750;
            background: #f8faff;
          }

          .upload-placeholder {
            color: #9ca3af;
            display: flex;
            align-items: center;
            justify-content: center;
             width: 100%;
            height: 100%;
          
          }

          .ratio-upload-area:hover .upload-placeholder {
            color: #5e2750;
          }

          .ratio-upload-area.has-upload {
            border-color: #22c55e;
            background: #f0fff4;
          }

          .ratio-upload-area.has-upload:hover {
            border-color: #16a34a;
            background: #dcfce7;
          }

          .ratio-tick {
            z-index: 10;
          }

          .ratio-label {
            font-weight: 600;
            color: #374151;
            font-size: 14px;
          }

          .section-divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #e5e7eb, transparent);
            margin: 40px 0;
          }

          .uploaded-section h3 {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 20px;
          }

          .uploaded-images {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .uploaded-image-card {
            display: flex;
            align-items: center;
            padding: 16px;
            background: white;
            border-radius: 8px;
            transition: all 0.2s ease;
          }

          .uploaded-image-card.valid {
            border: 2px solid #22c55e;
            background: #f0fff4;
          }

          .uploaded-image-card.invalid {
            border: 2px solid #ef4444;
            background: #fef2f2;
          }

          .uploaded-image-card:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .image-preview {
            width: 60px;
            height: 60px;
            border-radius: 6px;
            overflow: hidden;
            margin-right: 16px;
            flex-shrink: 0;
          }

          .image-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .image-info {
            flex: 1;
            min-width: 0;
          }

          .image-name {
            font-weight: 500;
            color: #374151;
            margin-bottom: 4px;
            word-break: break-word;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .valid-tick {
            color: #22c55e;
          }

          .image-details {
            display: flex;
            gap: 12px;
            margin-bottom: 4px;
            flex-wrap: wrap;
          }

          .image-ratio {
            background: #e0e7ff;
            color: #3730a3;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
          }

          .image-size {
            color: #6b7280;
            font-size: 12px;
          }

          .invalid-badge {
            background: #fee2e2;
            color: #dc2626;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
          }

          .upload-time {
            color: #9ca3af;
            font-size: 12px;
          }

          .remove-btn {
            background: none;
            border: none;
            color: #ef4444;
            cursor: pointer;
            padding: 8px;
            border-radius: 4px;
            transition: background-color 0.2s ease;
            margin-left: 12px;
          }

          .remove-btn:hover {
            background: #fee2e2;
          }

          .continue-section {
            margin-top: 24px;
            text-align: center;
          }

          .continue-btn {
            background: #5e2750;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }

          .continue-btn:hover {
            background: #5e2750;
          }

          .bulk-upload-btn {
            background: #f3f4f6;
            border: 2px dashed #9ca3af;
            color: #374151;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 14px;
          }

          .bulk-upload-btn:hover {
            background: #e5e7eb;
            border-color: #6b7280;
            color: #1f2937;
          }

          @media (max-width: 768px) {
            .ratio-grid {
              gap: 20px;
            }

            .uploaded-image-card {
              flex-direction: column;
              align-items: flex-start;
              gap: 12px;
            }

            .image-preview {
              margin-right: 0;
            }

            .remove-btn {
              margin-left: 0;
              align-self: flex-end;
            }
          }
        `}</style>
      </div>
    </div>
  ) : (
    <div className="project-banner-upload">
      {modalContent}
      <style jsx>{`
        .project-banner-upload {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .upload-header {
          margin-bottom: 30px;
        }

        .upload-header h2 {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin: 0 0 8px 0;
        }

        .upload-header p {
          color: #666;
          margin: 0;
          font-size: 14px;
        }

        .ratio-grid {
          display: flex;
          gap: 30px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 40px;
          padding: 40px 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .ratio-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .ratio-upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .ratio-upload-area:hover {
          border-color: #5e2750;
          background: #f8faff;
        }

        .upload-placeholder {
          color: #9ca3af;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .ratio-upload-area:hover .upload-placeholder {
          color: #5e2750;
        }

        .ratio-upload-area.has-upload {
          border-color: #22c55e;
          background: #f0fff4;
        }

        .ratio-upload-area.has-upload:hover {
          border-color: #16a34a;
          background: #dcfce7;
        }

        .ratio-tick {
          z-index: 10;
        }

        .ratio-label {
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .section-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e5e7eb, transparent);
          margin: 40px 0;
        }

        .uploaded-section h3 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 20px;
        }

        .uploaded-images {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .uploaded-image-card {
          display: flex;
          align-items: center;
          padding: 16px;
          background: white;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .uploaded-image-card.valid {
          border: 2px solid #22c55e;
          background: #f0fff4;
        }

        .uploaded-image-card.invalid {
          border: 2px solid #ef4444;
          background: #fef2f2;
        }

        .uploaded-image-card:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .image-preview {
          width: 60px;
          height: 60px;
          border-radius: 6px;
          overflow: hidden;
          margin-right: 16px;
          flex-shrink: 0;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-info {
          flex: 1;
          min-width: 0;
        }

        .image-name {
          font-weight: 500;
          color: #374151;
          margin-bottom: 4px;
          word-break: break-word;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .valid-tick {
          color: #22c55e;
        }

        .image-details {
          display: flex;
          gap: 12px;
          margin-bottom: 4px;
          flex-wrap: wrap;
        }

        .image-ratio {
          background: #e0e7ff;
          color: #3730a3;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .image-size {
          color: #6b7280;
          font-size: 12px;
        }

        .invalid-badge {
          background: #fee2e2;
          color: #dc2626;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .upload-time {
          color: #9ca3af;
          font-size: 12px;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: background-color 0.2s ease;
          margin-left: 12px;
        }

        .remove-btn:hover {
          background: #fee2e2;
        }

        .continue-section {
          margin-top: 24px;
          text-align: center;
        }

        .continue-btn {
          background: #5e2750;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .continue-btn:hover {
          background: #5e2750;
        }

        .bulk-upload-btn {
          background: #f3f4f6;
          border: 2px dashed #9ca3af;
          color: #374151;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .bulk-upload-btn:hover {
          background: #e5e7eb;
          border-color: #6b7280;
          color: #1f2937;
        }

        @media (max-width: 768px) {
          .ratio-grid {
            gap: 20px;
          }

          .uploaded-image-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .image-preview {
            margin-right: 0;
          }

          .remove-btn {
            margin-left: 0;
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectImageVideoUpload;