import React, { useState } from "react";
import styled from "styled-components";

const EngravingArt = () => {
  const [engravingImage, setEngravingImage] = useState(null);

  const handleEngravingImageUpload = (e) => {
    const file = e.target.files[0];
    setEngravingImage(file);
  };

  return (
    <EngravingContainer>
      <h3>Engraving Submission</h3>
      <EngravingForm>
        <InputLabel>Photo of Engraving</InputLabel>
        <ImageInput
          type="file"
          accept="image/*"
          onChange={handleEngravingImageUpload}
          required
        />
        {engravingImage && (
          <ImagePreview>
            <Thumbnail src={URL.createObjectURL(engravingImage)} />
          </ImagePreview>
        )}
        <SubmitButton type="submit">Submit to Install</SubmitButton>
      </EngravingForm>
    </EngravingContainer>
  );
};

export default EngravingArt;

const EngravingContainer = styled.div`
  background: #eec843;
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

const EngravingForm = styled.form`
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
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const Thumbnail = styled.img`
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 5px;
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
