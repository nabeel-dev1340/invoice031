import React from "react";
import styled from "styled-components";
import HorizontalRule from "./HorizontalRule";
import Logo from "../assets/images/memorial.png";

const BrandingSection = () => {
  return (
    <BrandingContainer>
      <BrandingLogo src={Logo} alt="branding" />
      <Branding>HEADSTONE WORLD</Branding>
      <BrandingInfo>
        <p>713-597-8899</p>
        <p>headstoneworld@yahoo.com</p>
        <p>15715 N.Frwy Service Rd Houston, TX 77090</p>
      </BrandingInfo>
      <HorizontalRule />
    </BrandingContainer>
  );
};

export default BrandingSection;

const BrandingContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding-top: 15px;
  background: #e7e9eb;
`;

const BrandingLogo = styled.img`
  width: 40px;
  height: 40px;
`;

const Branding = styled.h3``;
const BrandingInfo = styled.div`
  display: flex;
  gap: 20px;
`;
