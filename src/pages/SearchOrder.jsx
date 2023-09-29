import React, { useState } from "react";
import IconHome from "../assets/icons/home.png";
import { Link } from "react-router-dom";
import styled from "styled-components";
import IconWithText from "../components/IconWithTExt";

const SearchOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/work-orders?headstoneName=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openImagePopup = (image) => {
    setSelectedImage(image);
  };

  const closeImagePopup = () => {
    setSelectedImage(null);
  };

  return (
    <Container>
      <NavBar className="nav-bar">
        <StyledLink to="/landing-page">
          <IconWithText iconSrc={IconHome} text="Home" />
        </StyledLink>
      </NavBar>
      <Heading>Search Work Order</Heading>
      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Enter headstone name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchButton onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </SearchButton>
      </SearchBar>
      {searchResults.length > 0 ? (
        <ResultsContainer>
          <ResultsHeading>Search Results:</ResultsHeading>
          <ResultsGrid>
            {searchResults.map((result) => (
              <ResultTile key={result.invoiceNo}>
                <TileHeading>{result.headstoneName}</TileHeading>
                <TileInfo>Invoice No: {result.invoiceNo}</TileInfo>
                <ViewOrderButton onClick={() => openImagePopup(result.image)}>
                  View Order
                </ViewOrderButton>
              </ResultTile>
            ))}
          </ResultsGrid>
        </ResultsContainer>
      ) : (
        <NoResultsMessage>No results found</NoResultsMessage>
      )}
      {selectedImage && (
        <ImagePopup>
          <ImagePopupContent>
            <CloseButton onClick={closeImagePopup}>Close</CloseButton>
            <ScrollableImageContainer>
              <img src={selectedImage} alt="Work Order" />
            </ScrollableImageContainer>
          </ImagePopupContent>
        </ImagePopup>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const NavBar = styled.nav`
  background: #747c7c;
  display: flex;
  align-items: center;
  padding: 15px;

  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #000;
`;

const Heading = styled.h1`
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;

  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 24px; /* Rounded corners */
    width: 50%; /* 50% width */
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 24px; /* Rounded corners */
  width: 50%; /* 50% width */
  padding-left: 16px; /* Add some left padding */
`;

const SearchButton = styled.button`
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

const ResultsContainer = styled.div`
  background: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const ResultsHeading = styled.h3`
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const ResultTile = styled.div`
  background: #fff;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const TileHeading = styled.h4`
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
`;

const TileInfo = styled.p`
  font-size: 16px;
  color: #777;
  margin-bottom: 10px;
`;

const ViewOrderButton = styled.button`
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

const NoResultsMessage = styled.p`
  font-size: 16px;
  color: #777;
  text-align: center;
  margin-top: 20px;
`;

const ImagePopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ImagePopupContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  max-width: 80%; /* Limit the width of the popup */
`;

const ScrollableImageContainer = styled.div`
  max-height: 80vh; /* Set a maximum height for scrollability */
  overflow-y: auto; /* Enable vertical scrolling when needed */
  margin-top: 10px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ccc;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
`;

export default SearchOrder;