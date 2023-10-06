import React from 'react';
import styled from 'styled-components';
import Option from '../components/Option';
import { Link } from 'react-router-dom';
import headingImage from '../assets/images/memorial.png';
import invoiceImage from "../assets/images/invoice.png";
import searchImage from "../assets/images/search.png";


const LandingPage = () => {
    return (
      <LandingPageContainer>
        <Branding>
          {/* <HeadingImage src={headingImage} alt="Headstone World" /> */}
          <Heading>Welcome to Headstone World</Heading>
        </Branding>
        <OptionContainer>
          <StyledLink to="/invoice-form">
              <Option
                imageSrc={invoiceImage}
                text="Create New Invoice"
              />
          </StyledLink>
         <StyledLink to="/search-order">
            <Option
              imageSrc={searchImage}
              text="Search Order"
            />
         </StyledLink>
        </OptionContainer>
      </LandingPageContainer>
    );
  };

export default LandingPage;

const LandingPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 30px;
  background-color: #f5f5f5; /* Appropriate background color */
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #000; 
`;

const Branding = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
const Heading = styled.h1`
  text-align: center;
`;

const OptionContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const HeadingImage = styled.img`
  width: 80px;
  height: 80px;
`;
