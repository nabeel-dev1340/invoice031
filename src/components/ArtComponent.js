import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ArtComponent = ({ headStoneName, invoiceNo }) => {
  const [finalArtImages, setFinalArtImages] = useState([]);
  const [finalArtPreviews, setFinalArtPreviews] = useState([]);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [cemeteryApprovalImage, setCemeteryApprovalImage] = useState(null);

  const handleFinalArtUpload = (e) => {
    const files = Array.from(e.target.files);
    setFinalArtImages((prevImages) => [...prevImages, ...files]);
  };

  useEffect(() => {
    const imagePreviews = finalArtImages.map((file) =>
      URL.createObjectURL(file)
    );
    setFinalArtPreviews(imagePreviews);

    return () => {
      imagePreviews.forEach(URL.revokeObjectURL);
    };
  }, [finalArtImages]);

  const handleCemeteryApprovalUpload = (e) => {
    const file = e.target.files[0];
    setCemeteryApprovalImage(file);
  };

  const handleArtSubmission = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("headstoneName", headStoneName);
      formDataToSend.append("invoiceNo", invoiceNo);

      // Append final art images
      finalArtImages.forEach((file, index) => {
        formDataToSend.append(`finalArtImages`, file);
      });

      // Append cemetery approval image
      if (cemeteryApprovalImage) {
        formDataToSend.append("finalArtImages", cemeteryApprovalImage);
      }

      // Make a POST request to your API endpoint
      const response = await fetch("http://localhost:3000/art-submission", {
        method: "POST",
        body: formDataToSend,
      });

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
  };

  return (
    <ArtContainer>
      <h3>Artwork Submission</h3>
      <ArtForm>
        <InputLabel>Final Art</InputLabel>
        <ImageInput
          type="file"
          accept="image/*"
          name="finalArtImages"
          multiple
          onChange={handleFinalArtUpload}
          required
        />
        <ImagePreview>
          {finalArtPreviews.map((image, index) => (
            <Thumbnail key={index} src={image} />
          ))}
        </ImagePreview>
        <InputLabel>Cemetery Approval</InputLabel>
        <ImageInput
          type="file"
          accept="image/*"
          onChange={handleCemeteryApprovalUpload}
          required
        />
        <SubmitButton
          type="button"
          onClick={handleArtSubmission}
          disabled={
            finalArtImages.length <= 0 ||
            cemeteryApprovalImage === null ||
            submissionSuccess
          }
        >
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
  width: 80%;
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
