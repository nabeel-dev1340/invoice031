import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ArtComponent = ({
  headStoneName,
  invoiceNo,
  finalArt,
  cemeteryApproval,
}) => {
  const [finalArtImagesBase64, setFinalArtImagesBase64] = useState([]);
  const [cemeteryApprovalImagesBase64, setCemeteryApprovalImagesBase64] =
    useState([]);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // useEffect to set image states
  useEffect(() => {
    if (finalArt && finalArt.length > 0) {
      const extractedBase64Images = finalArt.map((item) => item?.base64Data);
      setFinalArtImagesBase64(extractedBase64Images);
    }
    if (cemeteryApproval && cemeteryApproval.length > 0) {
      const extractedBase64CemeteryImages = cemeteryApproval.map(
        (item) => item?.base64Data
      );
      setCemeteryApprovalImagesBase64(extractedBase64CemeteryImages);
    }
  }, [finalArt, cemeteryApproval]);

  const handleFinalArtUpload = (e) => {
    const files = Array.from(e.target.files);

    const loadImages = async () => {
      for (const file of files) {
        const reader = new FileReader();

        reader.onload = () => {
          setFinalArtImagesBase64((prevImages) => [
            ...prevImages,
            reader.result,
          ]);
        };

        reader.readAsDataURL(file);
      }
    };

    loadImages();
  };

  // Handle multiple cemetery approval uploads
  const handleCemeteryApprovalUpload = (e) => {
    const files = Array.from(e.target.files);

    const loadImages = async () => {
      for (const file of files) {
        const reader = new FileReader();

        reader.onload = () => {
          setCemeteryApprovalImagesBase64((prevImages) => [
            ...prevImages,
            reader.result,
          ]);
        };

        reader.readAsDataURL(file);
      }
    };

    loadImages();
  };
  const submitToArt = async (e) => {
    e.preventDefault();

    if (
      finalArtImagesBase64.length > 0 ||
      cemeteryApprovalImagesBase64.length > 0
    ) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("headstoneName", headStoneName);
        formDataToSend.append("invoiceNo", invoiceNo);
        formDataToSend.append("finalArtLength", finalArtImagesBase64.length);
        formDataToSend.append(
          "cemeteryArtLength",
          cemeteryApprovalImagesBase64.length
        );

        // Append final art images
        finalArtImagesBase64.forEach((base64Image, index) => {
          const blob = dataURLtoBlob(base64Image);
          formDataToSend.append(`finalArtImages`, blob, `image${index}.png`);
        });

        cemeteryApprovalImagesBase64.forEach((base64Image, index) => {
          const blob = dataURLtoBlob(base64Image);
          formDataToSend.append(`finalArtImages`, blob, `image${index}.png`);
        });

        // Make a POST request to your API endpoint
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/art-submission`,
          {
            method: "POST",
            headers: {
              "ngrok-skip-browser-warning": "69420",
            },
            body: formDataToSend,
          }
        );

        if (response.ok) {
          // Handle successful response (e.g., show a success message)
          console.log("Art submission successful!");
          setSubmissionSuccess(true);
        } else {
          // Handle error response
          console.error("Art submission failed.");
        }
      } catch (error) {
        console.error("Error submitting art:", error);
      }
    } else {
      console.log("No images to submit");
    }
  };

  const removeFinalArtImage = (index) => {
    const updatedImages = [...finalArtImagesBase64];
    updatedImages.splice(index, 1);
    setFinalArtImagesBase64(updatedImages);
  };

  const removeCemeteryApprovalImage = (index) => {
    const updatedImages = [...cemeteryApprovalImagesBase64];
    updatedImages.splice(index, 1);
    setCemeteryApprovalImagesBase64(updatedImages);
  };

  function dataURLtoBlob(dataURL) {
    const parts = dataURL.split(",");
    const contentType = parts[0].split(";")[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uint8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; i++) {
      uint8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uint8Array], { type: contentType });
  }

  return (
    <ArtContainer>
      <h3>Artwork Submission</h3>
      <ArtForm>
        <InputLabel>Final Art</InputLabel>
        <ImageInput
          type="file"
          name="finalArtImages"
          multiple
          onChange={handleFinalArtUpload}
        />
        <ImagePreview>
          {finalArtImagesBase64.map((base64Image, index) => (
            <div key={index} className="thumbnail-container">
              <span
                className="delete-button"
                onClick={() => removeFinalArtImage(index)}
              >
                &#x2716;
              </span>
              <Thumbnail src={base64Image} alt="Non-image file" />
            </div>
          ))}
        </ImagePreview>
        <InputLabel>Cemetery Approval</InputLabel>
        <ImageInput
          type="file"
          multiple // Allow multiple file selection
          onChange={handleCemeteryApprovalUpload}
        />
        <ImagePreview>
          {cemeteryApprovalImagesBase64.map((base64Image, index) => (
            <div key={index} className="thumbnail-container">
              <span
                className="delete-button"
                onClick={() => removeCemeteryApprovalImage(index)}
              >
                &#x2716;
              </span>
              <Thumbnail src={base64Image} alt="Non-image file" />
            </div>
          ))}
        </ImagePreview>
        <SubmitButton type="button" onClick={submitToArt}>
          {submissionSuccess ? "Submitted" : "Submit to Engraving"}
        </SubmitButton>
      </ArtForm>
    </ArtContainer>
  );
};

export default ArtComponent;

const ArtContainer = styled.div`
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  h3 {
    font-size: 24px;
  }
`;

const ArtForm = styled.div`
  margin-top: 20px;
`;

const InputLabel = styled.label`
  font-size: 16px;
  color: #333;
  display: block;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ImageInput = styled.input`
  display: block;
  margin-bottom: 10px;
`;

const ImagePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .thumbnail-container {
    position: relative;
    margin: 5px;
  }

  .thumbnail {
    max-width: 100px;
    max-height: 100px;
    border: 1px solid #ddd;
  }

  .delete-button {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
    color: #f00; /* Red color */
    font-size: 20px;
  }
`;

const Thumbnail = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
  margin: 10px;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;
