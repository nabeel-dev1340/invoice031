import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ArtComponent = () => {
  const [finalArtImages, setFinalArtImages] = useState([]);
  const [finalArtPreviews, setFinalArtPreviews] = useState([]);
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

  return (
    <ArtContainer>
      <h3>Artwork Submission</h3>
      <ArtForm>
        <InputLabel>Final Art</InputLabel>
        <ImageInput
          type="file"
          accept="image/*"
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
        <SubmitButton type="submit">Submit to Engraving</SubmitButton>
      </ArtForm>
    </ArtContainer>
  );
};

export default ArtComponent;

const ArtContainer = styled.div`
  background-color: #F5F5F5;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  width:80%;
  margin-left: auto;
  margin-right: auto;
  h3{
    font-size: 24px;
  }
`;

const ArtForm = styled.form`
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
