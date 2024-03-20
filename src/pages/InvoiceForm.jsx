import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import IconWithText from "../components/IconWithTExt";
import IconHome from "../assets/icons/home.png";
import IconSave from "../assets/icons/diskette.png";
import IconPrint from "../assets/icons/printing.png";
import BrandingSection from "../components/BrandingSection";
import HorizontalRule from "../components/HorizontalRule";
import {
  cemeteryNames,
  getCemeteryDataByName,
} from "../utils/cemeteryFunctions";
import ImageModal from "../components/ImageModal";
import colorOptions from "../utils/colorOptions";
import SuccessModal from "../components/SuccessModal";
import axios from "axios";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const InvoicehtmlForm = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [successModalIsOpen, setSuccessModalIsOpen] = useState(false);
  const [saveButtonText, setSaveButtonText] = useState("Save");
  const [modalIndex, setModalIndex] = useState(0);
  const [deposits, setDeposits] = useState([]);
  const [selectedCemetery, setSelectedCemetery] = useState("");
  const [customCemetery, setCustomCemetery] = useState("");

  const location = useLocation();

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleOpenModal = (index) => {
    setModalIsOpen(true);
    setModalIndex(index);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleSuccessModalOpen = () => {
    setSuccessModalIsOpen(true);
  };

  const handleSuccessModalClose = () => {
    setSuccessModalIsOpen(false);
  };

  const handleImageSelect = (imageSrc, imageTitle, modelIndex) => {
    // Update the selected model image in your form data
    if (modelIndex === 1) {
      setFormData((prevData) => ({
        ...prevData,
        model1: imageSrc,
        selectModelImage1: imageTitle,
      }));
    } else if (modelIndex === 2) {
      setFormData((prevData) => ({
        ...prevData,
        model2: imageSrc,
        selectModelImage2: imageTitle,
      }));
    } else if (modelIndex === 3) {
      setFormData((prevData) => ({
        ...prevData,
        model3: imageSrc,
        selectModelImage3: imageTitle,
      }));
    } else if (modelIndex === 4) {
      setFormData((prevData) => ({
        ...prevData,
        model4: imageSrc,
        selectModelImage4: imageTitle,
      }));
    }
    handleCloseModal();
  };

  const generateInvoiceNumber = () => {
    const timestamp = new Date().getTime().toString();
    let randomDigits = "";

    // Generate 5 random indices within the timestamp length
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * timestamp.length);
      randomDigits += timestamp.charAt(randomIndex);
    }

    return `INV-${randomDigits}`;
  };

  useEffect(() => {
    const uniqueInvoiceNumber = generateInvoiceNumber();
    setFormData((prevData) => ({
      ...prevData,
      invoiceNo: uniqueInvoiceNumber,
      username: localStorage.getItem("username"),
    }));
    // Make the "invoiceNo" field read-only
    document.getElementById("invoice").readOnly = true;
  }, []);

  // Update the form data to include the initial today's date
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10);

    setFormData((prevData) => ({
      ...prevData,
      date: formattedDate, // Pre-set the date field to today's date
    }));
  }, []);

  const handlePrint = (e) => {
    e.preventDefault(); // Prevent the form submission
    document.title = "Computerized Invoice";
    window.print();
  };

  // get old data
  useEffect(() => {
    if (location.state) {
      console.log(location.state);
      setFormData(location.state?.data);
      if (location.state?.deposits) {
        setDeposits(location.state?.deposits);
      }
      if (location.state?.data?.customCemetery) {
        setSelectedCemetery("Other");
        setCustomCemetery(location.state.data.customCemetery);
        setFormData((prevData) => ({
          ...prevData,
          cemetery: "Other", // Set formData.cemetery to "Other"
        }));
      }
    }
  }, [location.state]);

  // Initialize state to store form data
  const [formData, setFormData] = useState({
    headstoneName: "",
    invoiceNo: "",
    date: "",
    username: "",
    cemetery: "",
    cemeteryAddress: "",
    cemeteryContact: "",
    cemeteryPhone: "",
    zone: "",
    lotOwner: "",
    lotNumber: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    model1: "",
    selectModelImage1: "",
    modelColor1: "",
    customColor1: "",
    modelQty1: "",
    modelPrice1: "",
    subTotal: 0,
    tax: "",
    delivery: "",
    foundation: "",
    discount: 0,
    total: "",
    deposit: "",
    paymentMethod: "",
    balance: "",
    details: "",
    model2: "",
    selectModelImage2: "",
    modelColor2: "",
    customColor2: "",
    modelQty2: "",
    modelPrice2: "",
    model3: "",
    selectModelImage3: "",
    modelColor3: "",
    customColor3: "",
    modelQty3: "",
    modelPrice3: "",
    model4: "",
    selectModelImage4: "",
    modelColor4: "",
    customColor4: "",
    modelQty4: "",
    modelPrice4: "",
    model5: "",
    modelColor5: "",
    customColor5: "",
    modelQty5: "",
    modelPrice5: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    // Fetch and update cemetery data if cemetery is selected
    if (name === "cemetery") {
      if (value !== "Other") {
        const selectedCemeteryData = getCemeteryDataByName(value);
        setSelectedCemetery(value);
        if (selectedCemeteryData) {
          updatedFormData = {
            ...updatedFormData,
            cemeteryAddress: selectedCemeteryData.ADDRESS,
            cemeteryContact: selectedCemeteryData.CONTACT_NAME,
            cemeteryPhone: selectedCemeteryData.PHONE,
            zone: selectedCemeteryData.Zone,
          };
        }
      } else {
        setSelectedCemetery(value);
      }
    }

    if (name === "customCemetery") {
      setCustomCemetery(value);
      // Update formData.cemetery when "Other" is selected
      updatedFormData = {
        ...updatedFormData,
        customCemetery: value, // Update formData.cemetery here
      };
    }

    if (name === "deposit") {
      const total = parseFloat(formData.total) || 0;
      // Calculate sum of deposit amounts
      const depositSum = deposits.reduce(
        (accumulator, currentDeposit) =>
          accumulator + parseFloat(currentDeposit.depositAmount || 0),
        0
      );

      // Compute the balance
      const balance = total - depositSum - updatedFormData.deposit;

      updatedFormData.balance = balance;
    }

    // Calculate subtotal when modelQty or modelPrice changes for all 4 models
    for (let i = 1; i <= 5; i++) {
      const qtyName = `modelQty${i}`;
      const priceName = `modelPrice${i}`;

      if (name === qtyName || name === priceName) {
        const quantity = parseFloat(updatedFormData[qtyName]);
        const price = parseFloat(updatedFormData[priceName]);

        if (!isNaN(quantity) && !isNaN(price)) {
          updatedFormData.subTotal = 0; // Reset subtotal
          for (let j = 1; j <= 5; j++) {
            const subQty = parseFloat(updatedFormData[`modelQty${j}`]);
            const subPrice = parseFloat(updatedFormData[`modelPrice${j}`]);
            if (!isNaN(subQty) && !isNaN(subPrice)) {
              updatedFormData.subTotal += subQty * subPrice;
            }
          }
          updatedFormData.subTotal = updatedFormData.subTotal.toFixed(2);
        }
      }
    }

    // Calculate total based on subtotal, tax, stake/delivery, and foundation
    const subTotal = parseFloat(updatedFormData.subTotal);
    const delivery = parseFloat(updatedFormData.delivery);
    const foundation = parseFloat(updatedFormData.foundation);
    const deposit = parseFloat(updatedFormData.deposit);
    const balance = parseFloat(updatedFormData.balance);
    const discountAmount = parseFloat(updatedFormData.discount); // Retrieve the discount amount

    const depositIsValid = !isNaN(deposit);
    const balanceIsValid = !isNaN(balance);

    // Calculate the total without discount
    let totalBeforeTax = subTotal;

    if (!isNaN(delivery)) {
      totalBeforeTax += delivery;
    }

    if (!isNaN(foundation)) {
      totalBeforeTax += foundation;
    }

    const taxPercentage = 8.25; // Fixed tax percentage
    const tax = (totalBeforeTax * (taxPercentage / 100)).toFixed(2);
    updatedFormData.tax = tax;

    // Apply the discount amount
    if (!isNaN(discountAmount) && discountAmount > 0) {
      updatedFormData.total = (
        totalBeforeTax -
        discountAmount +
        parseFloat(tax)
      ).toFixed(2);
    } else {
      updatedFormData.total = (totalBeforeTax + parseFloat(tax)).toFixed(2);
    }

    setFormData(updatedFormData);
  };

  useEffect(() => {
    const total = parseFloat(formData.total) || 0;

    // Calculate sum of deposit amounts
    const depositSum = deposits.reduce(
      (accumulator, currentDeposit) =>
        accumulator + parseFloat(currentDeposit.depositAmount || 0),
      0
    );

    // Compute the balance
    const balance = total - depositSum;

    // Update the 'balance' field in the form data
    setFormData((prevFormData) => ({
      ...prevFormData,
      balance: balance.toFixed(2),
    }));
  }, [deposits, formData.total]);

  const captureFormSnapshot = async () => {
    const pdf = new jsPDF({
      unit: "mm", // Use millimeters as the unit of measurement
      format: "a4", // Set the paper size to A4
    });

    // Capture the form as an image using html-to-image
    const element = document.getElementById("invoice-form");
    const imageDataUrl = await htmlToImage.toPng(element);

    // Create an Image object for the captured image
    const img = new Image();
    img.src = imageDataUrl;

    img.onload = async function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      // Get the width and height of the captured image
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Calculate the aspect ratio to fit the canvas within the A4 paper size
      const aspectRatio = canvasWidth / canvasHeight;

      // Calculate the width and height of the image in the PDF
      let pdfWidth = 190; // A4 paper width in millimeters
      let pdfHeight = pdfWidth / aspectRatio;

      // Ensure that the image fits within the A4 paper size
      if (pdfHeight > 277) {
        pdfHeight = 277; // A4 paper height in millimeters
        pdfWidth = pdfHeight * aspectRatio;
      }

      // Calculate the center position to place the image on the A4 page
      const xPosition = (210 - pdfWidth) / 2; // A4 paper width is 210mm
      const yPosition = (297 - pdfHeight) / 2; // A4 paper height is 297mm

      // Add the captured image to the PDF
      pdf.addImage(
        imageDataUrl,
        "PNG",
        xPosition,
        yPosition,
        pdfWidth,
        pdfHeight
      );

      // Save the PDF as a blob
      const pdfBlob = pdf.output("blob");

      //delete custom Cemetery
      if (selectedCemetery !== "Other") {
        delete formData?.customCemetery;
      }

      // Create a FormData object to send the blob to the backend
      const finalFormData = new FormData();
      finalFormData.append("pdf", pdfBlob, "invoice.pdf");
      // Append each field of formData to finalFormData
      for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
          finalFormData.append(key, formData[key]);
        }
      }

      try {
        // Make an API call to save the PDF and additional data on the backend
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/save-invoice`, // Replace with your backend API endpoint
          finalFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );

        if (response.status === 200) {
          // Success, you can handle it as needed
          console.log("PDF and data saved successfully");
          console.log(formData);
          // Show success modal
          handleSuccessModalOpen();
          setSaveButtonText("Saved");
        } else {
          console.error("Failed to save PDF and data");
          setSaveButtonText("Save");
        }
      } catch (error) {
        console.error("Error while saving PDF and data:", error);
        setSaveButtonText("Save");
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveButtonText("Saving..");
    try {
      // Update deposit
      if (!isNaN(parseFloat(formData.deposit))) {
        const depositAmount = parseFloat(formData.deposit);
        const newDeposit = {
          depositAmount: depositAmount.toFixed(2),
          date: new Date().toISOString().split("T")[0],
          paymentMethod: formData.paymentMethod,
        };

        // Perform actions like updating state with the deposit
        setDeposits((prevDeposits) => [...prevDeposits, newDeposit]);
      }
      // Capture the form snapshot as a PDF
      setTimeout(async () => {
        await captureFormSnapshot();
      }, 1000);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <NavBar className="nav-bar">
          <StyledLink to="/landing-page">
            <IconWithText iconSrc={IconHome} text="Home" />
          </StyledLink>
          <UtilityContainer>
            {localStorage.getItem("role") !== "viewer" ? (
              <IconWithText
                iconSrc={IconSave}
                type="submit"
                text={saveButtonText}
              />
            ) : null}
            <IconWithText
              iconSrc={IconPrint}
              onClick={handlePrint}
              text="Print"
            />
          </UtilityContainer>
        </NavBar>
        <div id="invoice-form">
          <BrandingSection />
          <HeadstoneInfoSection>
            <div
              className="input-row"
              style={{ width: "80%", margin: "0 auto" }}
            >
              <label htmlFor="name" style={{ marginRight: "10px" }}>
                Name on Headstone:
              </label>
              <input
                type="text"
                id="name"
                name="headstoneName"
                value={formData.headstoneName}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter name to be written on Headstone"
                readOnly={localStorage.getItem("role") === "viewer"}
                required
              />
            </div>
            <div className="input-row">
              <label htmlFor="invoice" className="flexy">
                Invoice Number:
              </label>
              <input
                type="text"
                id="invoice"
                name="invoiceNo"
                value={formData.invoiceNo}
                readOnly
              />
              <label htmlFor="date" className="flexy">
                Date:
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                readOnly={localStorage.getItem("role") === "viewer"}
              />
            </div>
          </HeadstoneInfoSection>
          <HorizontalRule />
          <CemetrySection>
            <table>
              <tbody>
                <tr className="input-row">
                  <th>
                    <label htmlFor="cemetery">Cemetery:</label>
                  </th>
                  <td colSpan="3">
                    <select
                      id="cemetery"
                      name="cemetery"
                      value={formData.cemetery}
                      onChange={handleInputChange}
                      disabled={localStorage.getItem("role") === "viewer"}
                    >
                      <option value="">Select Cemetery</option>
                      {cemeteryNames.map((cemeteryName) => (
                        <option key={cemeteryName} value={cemeteryName}>
                          {cemeteryName}
                        </option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                    {selectedCemetery === "Other" && (
                      <input
                        type="text"
                        name="customCemetery"
                        value={customCemetery}
                        onChange={handleInputChange}
                        placeholder="Enter Cemetery Name"
                        onKeyPress={handleKeyPress}
                      />
                    )}
                  </td>
                </tr>
                <tr className="input-row">
                  <th>
                    <label htmlFor="address">Address:</label>
                  </th>
                  <td>
                    <input
                      type="text"
                      id="address"
                      readOnly={localStorage.getItem("role") === "viewer"}
                      name="cemeteryAddress"
                      value={formData.cemeteryAddress}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                    />
                  </td>
                  <th>
                    <label htmlFor="cemeteryContact">Cemetery Contact:</label>
                  </th>
                  <td>
                    <input
                      type="text"
                      id="cemeteryContact"
                      name="cemeteryContact"
                      readOnly={localStorage.getItem("role") === "viewer"}
                      value={formData.cemeteryContact}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                    />
                  </td>
                  <th>
                    <label htmlFor="phone">Phone:</label>
                  </th>
                  <td>
                    <input
                      type="text"
                      id="phone"
                      name="Cemeteryphone"
                      onChange={handleInputChange}
                      value={formData.cemeteryPhone}
                      readOnly={localStorage.getItem("role") === "viewer"}
                      onKeyPress={handleKeyPress}
                    />
                  </td>
                </tr>
                <tr className="input-row">
                  <th>
                    <label htmlFor="zone">Zone:</label>
                  </th>
                  <td>
                    <input
                      type="text"
                      id="zone"
                      name="zone"
                      value={formData.zone}
                      readOnly={localStorage.getItem("role") === "viewer"}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                    />
                  </td>
                  <th>
                    <label htmlFor="lotOwner">Lot Owner:</label>
                  </th>
                  <td>
                    <input
                      type="text"
                      id="lotOwner"
                      name="lotOwner"
                      value={formData.lotOwner}
                      onChange={handleInputChange}
                      readOnly={localStorage.getItem("role") === "viewer"}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter Lot"
                    />
                  </td>
                  <th>
                    <label htmlFor="lotNumber">Lot Number:</label>
                  </th>
                  <td>
                    <input
                      type="text"
                      id="lotNumber"
                      name="lotNumber"
                      value={formData.lotNumber}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      readOnly={localStorage.getItem("role") === "viewer"}
                      placeholder="Enter lot number"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </CemetrySection>
          <HorizontalRule />
          <CustomerDetailsSection>
            <div className="row">
              <label htmlFor="customerName">Customer Name:</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                readOnly={localStorage.getItem("role") === "viewer"}
                onKeyPress={handleKeyPress}
                placeholder="Enter customer name"
              />
              <label htmlFor="phone">Phone:</label>
              <input
                type="text"
                id="phone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                readOnly={localStorage.getItem("role") === "viewer"}
                onKeyPress={handleKeyPress}
                placeholder="Enter customer phone"
              />
            </div>
            <div className="row">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="customerEmail"
                value={formData.customerEmail}
                readOnly={localStorage.getItem("role") === "viewer"}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter customer email"
              />
            </div>
          </CustomerDetailsSection>
          <HorizontalRule />
          <AccountsSection>
            <div className="model-row">
              <div className="model-input model-flex">
                {/* <label htmlFor="model">Model:</label> */}
                <SelectModelButton
                  type="button"
                  onClick={() => handleOpenModal(1)}
                  disabled={localStorage.getItem("role") === "viewer"}
                  style={{ width: "9.5rem" }}
                >
                  Select Model
                </SelectModelButton>
              </div>
              {formData.model1 !== "" && (
                <div className="selected-image">
                  <img
                    src={formData.model1}
                    style={{ width: "100px", height: "70px" }}
                    alt="Selected Model"
                  />
                  <p style={{ textAlign: "center" }}>
                    {formData.selectModelImage1}
                  </p>
                </div>
              )}
              <div className="model-color model-flex">
                <label htmlFor="model-color">Color:</label>
                <select
                  id="model-color"
                  name="modelColor1"
                  value={formData.modelColor1}
                  onChange={handleInputChange}
                  disabled={localStorage.getItem("role") === "viewer"}
                >
                  <option value="">Select Color</option>
                  {Object.keys(colorOptions).map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                  <option value={"Custom Color"}>{"Custom Color"}</option>
                </select>
                {formData.modelColor1 === "Custom Color" && (
                  <input
                    type="text"
                    placeholder="Enter Color"
                    id="customColor1"
                    readOnly={localStorage.getItem("role") === "viewer"}
                    name="customColor1"
                    value={formData.customColor1}
                    onChange={(e) => {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        customColor1: e.target.value,
                      }));
                    }}
                    style={{
                      maxWidth: "100%",
                      width: "6rem",
                    }}
                  />
                )}
              </div>

              <div className="model-qty model-flex">
                <label htmlFor="model-qty">Qty:</label>
                <input
                  type="number"
                  name="modelQty1"
                  min={1}
                  readOnly={localStorage.getItem("role") === "viewer"}
                  value={formData.modelQty1}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter Quantity"
                  style={{ width: "100%", maxWidth: "3.8em" }}
                />
              </div>
              <div className="model-price model-flex">
                <label htmlFor="model-price">Price:</label>
                <input
                  type="text"
                  name="modelPrice1"
                  value={formData.modelPrice1}
                  onChange={handleInputChange}
                  readOnly={localStorage.getItem("role") === "viewer"}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter Price"
                />
              </div>
            </div>
            <div className="model-row">
              <div className="model-input model-flex">
                {/* <label htmlFor="model">Model:</label> */}
                <SelectModelButton
                  type="button"
                  onClick={() => handleOpenModal(2)}
                  disabled={localStorage.getItem("role") === "viewer"}
                  style={{ width: "9.5rem" }}
                >
                  Select Model
                </SelectModelButton>
              </div>
              {formData.model2 !== "" && (
                <div className="selected-image">
                  <img
                    src={formData.model2}
                    style={{ width: "100px", height: "70px" }}
                    alt="Selected Model"
                  />
                  <p style={{ textAlign: "center" }}>
                    {formData.selectModelImage2}
                  </p>
                </div>
              )}
              <div className="model-color model-flex">
                <label htmlFor="model-color">Color:</label>
                <select
                  id="model-color"
                  name="modelColor2"
                  disabled={localStorage.getItem("role") === "viewer"}
                  value={formData.modelColor2}
                  onChange={handleInputChange}
                >
                  <option value="">Select Color</option>
                  {Object.keys(colorOptions).map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                  <option value={"Custom Color"}>{"Custom Color"}</option>
                </select>
                {formData.modelColor2 === "Custom Color" && (
                  <input
                    type="text"
                    placeholder="Enter Color"
                    id="customColor2"
                    name="customColor2"
                    readOnly={localStorage.getItem("role") === "viewer"}
                    value={formData.customColor2}
                    onChange={(e) => {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        customColor2: e.target.value,
                      }));
                    }}
                    style={{
                      maxWidth: "100%",
                      width: "6rem",
                    }}
                  />
                )}
              </div>
              <div className="model-qty model-flex">
                <label htmlFor="model-qty">Qty:</label>
                <input
                  type="number"
                  readOnly={localStorage.getItem("role") === "viewer"}
                  name="modelQty2"
                  min={1}
                  value={formData.modelQty2}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter Quantity"
                  style={{ width: "100%", maxWidth: "3.8em" }}
                />
              </div>
              <div className="model-price model-flex">
                <label htmlFor="model-price">Price:</label>
                <input
                  type="text"
                  name="modelPrice2"
                  value={formData.modelPrice2}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  readOnly={localStorage.getItem("role") === "viewer"}
                  placeholder="Enter Price"
                />
              </div>
            </div>
            <div className="model-row">
              <div className="model-input model-flex">
                {/* <label htmlFor="model">Model:</label> */}
                <SelectModelButton
                  type="button"
                  onClick={() => handleOpenModal(3)}
                  disabled={localStorage.getItem("role") === "viewer"}
                  style={{ width: "9.5rem" }}
                >
                  Select Model
                </SelectModelButton>
              </div>
              {formData.model3 !== "" && (
                <div className="selected-image">
                  <img
                    src={formData.model3}
                    style={{ width: "100px", height: "70px" }}
                    alt="Selected Model"
                  />
                  <p style={{ textAlign: "center" }}>
                    {formData.selectModelImage3}
                  </p>
                </div>
              )}
              <div className="model-color model-flex">
                <label htmlFor="model-color">Color:</label>
                <select
                  id="model-color"
                  name="modelColor3"
                  disabled={localStorage.getItem("role") === "viewer"}
                  value={formData.modelColor3}
                  onChange={handleInputChange}
                >
                  <option value="">Select Color</option>
                  {Object.keys(colorOptions).map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                  <option value={"Custom Color"}>{"Custom Color"}</option>
                </select>
                {formData.modelColor3 === "Custom Color" && (
                  <input
                    type="text"
                    placeholder="Enter Color"
                    id="customColor3"
                    name="customColor3"
                    readOnly={localStorage.getItem("role") === "viewer"}
                    value={formData.customColor3}
                    onChange={(e) => {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        customColor3: e.target.value,
                      }));
                    }}
                    style={{
                      maxWidth: "100%",
                      width: "6rem",
                    }}
                  />
                )}
              </div>
              <div className="model-qty model-flex">
                <label htmlFor="model-qty">Qty:</label>
                <input
                  type="number"
                  name="modelQty3"
                  readOnly={localStorage.getItem("role") === "viewer"}
                  min={1}
                  value={formData.modelQty3}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter Quantity"
                  style={{ width: "100%", maxWidth: "3.8em" }}
                />
              </div>
              <div className="model-price model-flex">
                <label htmlFor="model-price">Price:</label>
                <input
                  type="text"
                  name="modelPrice3"
                  value={formData.modelPrice3}
                  onKeyPress={handleKeyPress}
                  readOnly={localStorage.getItem("role") === "viewer"}
                  onChange={handleInputChange}
                  placeholder="Enter Price"
                />
              </div>
            </div>
            <div className="model-row">
              <div className="model-input model-flex">
                {/* <label htmlFor="model">Model:</label> */}
                <input
                  type="text"
                  name="model4"
                  readOnly={localStorage.getItem("role") === "viewer"}
                  value={formData.model4}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter model"
                  style={{ width: "10rem" }}
                />
              </div>
              <div className="model-color model-flex">
                <label htmlFor="model-color">Color:</label>
                <select
                  id="model-color"
                  name="modelColor4"
                  value={formData.modelColor4}
                  disabled={localStorage.getItem("role") === "viewer"}
                  onChange={handleInputChange}
                >
                  <option value="">Select Color</option>
                  {Object.keys(colorOptions).map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                  <option value={"Custom Color"}>{"Custom Color"}</option>
                </select>
                {formData.modelColor4 === "Custom Color" && (
                  <input
                    type="text"
                    placeholder="Enter Color"
                    id="customColor4"
                    name="customColor4"
                    value={formData.customColor4}
                    readOnly={localStorage.getItem("role") === "viewer"}
                    onChange={(e) => {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        customColor4: e.target.value,
                      }));
                    }}
                    style={{
                      maxWidth: "100%",
                      width: "6rem",
                    }}
                  />
                )}
              </div>
              <div className="model-qty model-flex">
                <label htmlFor="model-qty">Qty:</label>
                <input
                  type="number"
                  name="modelQty4"
                  readOnly={localStorage.getItem("role") === "viewer"}
                  min={1}
                  value={formData.modelQty4}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter Quantity"
                  style={{ width: "100%", maxWidth: "3.8em" }}
                />
              </div>
              <div className="model-price model-flex">
                <label htmlFor="model-price">Price:</label>
                <input
                  type="text"
                  name="modelPrice4"
                  readOnly={localStorage.getItem("role") === "viewer"}
                  value={formData.modelPrice4}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter Price"
                />
              </div>
            </div>
            <div className="model-row">
              <div className="model-input model-flex">
                {/* <label htmlFor="model">Model:</label> */}
                <input
                  type="text"
                  name="model5"
                  value={formData.model5}
                  onChange={handleInputChange}
                  readOnly={localStorage.getItem("role") === "viewer"}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter model"
                  style={{ width: "10rem" }}
                />
              </div>
              <div className="model-color model-flex">
                <label htmlFor="model-color">Color:</label>
                <select
                  id="model-color"
                  name="modelColor5"
                  value={formData.modelColor5}
                  disabled={localStorage.getItem("role") === "viewer"}
                  onChange={handleInputChange}
                >
                  <option value="">Select Color</option>
                  {Object.keys(colorOptions).map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                  <option value={"Custom Color"}>{"Custom Color"}</option>
                </select>
                {formData.modelColor5 === "Custom Color" && (
                  <input
                    type="text"
                    placeholder="Enter Color"
                    id="customColor5"
                    name="customColor5"
                    readOnly={localStorage.getItem("role") === "viewer"}
                    value={formData.customColor5}
                    onChange={(e) => {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        customColor5: e.target.value,
                      }));
                    }}
                    style={{
                      maxWidth: "100%",
                      width: "6rem",
                    }}
                  />
                )}
              </div>
              <div className="model-qty model-flex">
                <label htmlFor="model-qty">Qty:</label>
                <input
                  type="number"
                  name="modelQty5"
                  min={1}
                  readOnly={localStorage.getItem("role") === "viewer"}
                  value={formData.modelQty5}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter Quantity"
                  style={{ width: "100%", maxWidth: "3.8em" }}
                />
              </div>
              <div className="model-price model-flex">
                <label htmlFor="model-price">Price:</label>
                <input
                  type="text"
                  name="modelPrice5"
                  value={formData.modelPrice5}
                  readOnly={localStorage.getItem("role") === "viewer"}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter Price"
                />
              </div>
            </div>
            <div className="details-row">
              <div className="left-section">
                <div className="details-input">
                  <label htmlFor="details">Details:</label>
                  <textarea
                    id="details"
                    name="details"
                    rows="9"
                    cols="60"
                    readOnly={localStorage.getItem("role") === "viewer"}
                    value={formData.details}
                    onChange={handleInputChange}
                    placeholder="Enter details here"
                  ></textarea>
                </div>
                <div className="end-note">
                  <p>
                    Make all checks payable to Headstone World Houston
                    <br />
                    <span className="grey-highlight">
                      Complete orders left over 30 days subject to storage fee
                    </span>
                    <br />
                    Customer Responsible for Cemetery fee
                    <br />
                    <span className="grey-highlight">
                      All purchases are not eligible for refund or exhange
                    </span>
                    <br />
                    Headstone World is not responsible for mistakes
                    <br />
                    which appear in signed and approved orders
                    <br />
                    <br />
                    <strong>NOTE: </strong>
                    <em>
                      The negative balance displayed reflects an excess
                      <br />
                      in billed amounts over the deposited funds.This does not
                      <br />
                      indicate a credit or amount owed to you.
                      <br />
                    </em>
                    <strong>
                      Order left over 30 days incur a monthly storage charge of
                      $50.
                    </strong>
                  </p>
                </div>
              </div>
              <div className="right-section">
                <div className="total-inputs">
                  <div className="sub-total model-flex-right">
                    <label htmlFor="sub-total">Sub Total:</label>
                    <input
                      type="number"
                      name="subTotal"
                      value={formData.subTotal}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                  <div className="tax model-flex-right">
                    <label htmlFor="tax">Tax:</label>
                    <input
                      type="number"
                      name="tax"
                      value={formData.tax}
                      onChange={handleInputChange}
                      placeholder="8.25% of total"
                      readOnly
                    />
                  </div>
                  <div className="delivery model-flex-right">
                    <label htmlFor="delivery">Stake/Delivery:</label>
                    <input
                      type="number"
                      name="delivery"
                      value={formData.delivery}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter amount"
                      readOnly={localStorage.getItem("role") === "viewer"}
                    />
                  </div>
                  <div className="foundation model-flex-right">
                    <label htmlFor="foundation">Setting/Foundation:</label>
                    <input
                      type="number"
                      name="foundation"
                      value={formData.foundation}
                      onKeyPress={handleKeyPress}
                      onChange={handleInputChange}
                      placeholder="Enter amount"
                      readOnly={localStorage.getItem("role") === "viewer"}
                    />
                  </div>
                  <div className="discount model-flex-right">
                    <label htmlFor="discount">Discount:</label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onKeyPress={handleKeyPress}
                      onChange={handleInputChange}
                      readOnly={localStorage.getItem("role") === "viewer"}
                    />
                  </div>
                  <div className="total model-flex-right">
                    <label htmlFor="total">Total</label>
                    <input
                      type="number"
                      name="total"
                      value={formData.total}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                  <div className="deposit model-flex-right">
                    <label htmlFor="deposit">Deposit:</label>
                    <input
                      type="number"
                      name="deposit"
                      value={formData.deposit}
                      onKeyPress={handleKeyPress}
                      onChange={handleInputChange}
                      placeholder="Enter amount"
                      readOnly={localStorage.getItem("role") === "viewer"}
                    />
                  </div>
                  <div className="paymentMethod model-flex-right">
                    <label htmlFor="paymentMethod">Payment Method:</label>
                    <div
                      className=""
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: ".8rem",
                        paddingLeft: ".5rem",
                      }}
                    >
                      <div className="">
                        <input
                          type="radio"
                          id="Credit"
                          name="paymentMethod"
                          disabled={localStorage.getItem("role") === "viewer"}
                          value="Credit"
                          checked={formData.paymentMethod === "Credit"}
                          onChange={handleInputChange}
                        />
                        <label
                          style={{ paddingLeft: ".2rem" }}
                          htmlFor="Credit"
                        >
                          Credit
                        </label>
                      </div>
                      <div className="">
                        <input
                          type="radio"
                          id="Check"
                          name="paymentMethod"
                          disabled={localStorage.getItem("role") === "viewer"}
                          value="Check"
                          checked={formData.paymentMethod === "Check"}
                          onChange={handleInputChange}
                        />
                        <label style={{ paddingLeft: ".2rem" }} htmlFor="Check">
                          Check
                        </label>
                      </div>
                      <div className="">
                        <input
                          type="radio"
                          id="Cash"
                          name="paymentMethod"
                          value="Cash"
                          disabled={localStorage.getItem("role") === "viewer"}
                          checked={formData.paymentMethod === "Cash"}
                          onChange={handleInputChange}
                        />
                        <label style={{ paddingLeft: ".2rem" }} htmlFor="Cash">
                          Cash
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="balance model-flex-right">
                    <label htmlFor="balance">Balance:</label>
                    <input
                      type="number"
                      name="balance"
                      value={formData.balance}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                  <div className="deposits model-flex-rght">
                    {deposits.length > 0 &&
                      deposits.map((dep, index) => (
                        <div key={index} className="deposit-item">
                          <p>
                            <b>Deposit {`${index + 1}: `}</b>
                            {`$${dep.depositAmount}`} on {dep.date} {`(${dep.paymentMethod})`}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </AccountsSection>
        </div>
      </form>
      <ImageModal
        isOpen={modalIsOpen}
        modalIndex={modalIndex}
        closeModal={handleCloseModal}
        handleImageSelect={handleImageSelect}
      />
      <SuccessModal
        isOpen={successModalIsOpen}
        onClose={handleSuccessModalClose}
        headStoneName={formData.headstoneName}
        invoiceNo={formData.invoiceNo}
        date={formData.date}
        customerName={formData.customerName}
        customerEmail={formData.customerEmail}
        customerPhone={formData.customerPhone}
        cemeteryName={formData.cemetery}
        cemeteryAddress={formData.cemeteryAddress}
        cemeteryContact={formData.cemeteryContact}
        lotNumber={formData.lotNumber}
        customCemetery={formData?.customCemetery}
        details={formData?.details}
        model1={formData?.model1}
        selectModelImage1={formData?.selectModelImage1}
        modelColor1={formData?.modelColor1}
        model2={formData?.model2}
        selectModelImage2={formData?.selectModelImage2}
        modelColor2={formData?.modelColor2}
        model3={formData?.model3}
        selectModelImage3={formData?.selectModelImage3}
        modelColor3={formData?.modelColor3}
        model4={formData?.model4}
        modelColor4={formData?.modelColor4}
        model5={formData?.model5}
        modelColor5={formData?.modelColor5}
      />
    </Container>
  );
};

export default InvoicehtmlForm;

const Container = styled.div`
  width: 900px;
  max-width: 1200px;
  margin: 0 auto;

  @media print {
    .nav-bar {
      display: none;
    }
    title {
      display: none;
    }
  }
`;

const NavBar = styled.nav`
  background: white;
  display: flex;
  height: 60px;
  padding: 15px;
  border: 2px solid grey;
  border-radius: 5px;
  border-top: none;
  justify-content: space-between;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #000;
`;

const UtilityContainer = styled.div`
  display: flex;
  gap: 30px;
`;

const HeadstoneInfoSection = styled.section`
  background: #eec843;
  .input-row {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
  }

  .input-row .flexy {
    flex: 1;
    text-align: right;
    margin-right: 10px;
  }

  .input-row input[type="text"],
  .input-row input[type="date"] {
    flex: 2;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }

  input[type="submit"] {
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  input[type="submit"]:hover {
    background-color: #45a049;
  }

  @media screen and (max-width: 480px) {
    .headstone-section {
      max-width: 100%;
    }

    .input-row {
      flex-wrap: wrap;
    }

    .input-row label,
    .input-row input[type="text"],
    .input-row input[type="date"] {
      flex: 100%;
    }

    input[type="submit"] {
      flex: 100%;
    }
  }
`;

const CemetrySection = styled.div`
  background: #5887fb;
  padding: 10px;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  label {
    font-weight: normal;
  }
  th,
  td {
    padding: 5px;
    text-align: left;
    vertical-align: middle;
  }

  th {
    /* background-color: #f2f2f2; */
  }

  .input-row select,
  .input-row input[type="text"] {
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 5px; /* Add padding for spacing */
  }

  .input-row select,
  .input-row input[type="text"]:focus {
    border: 1px solid #ccc;
  }

  @media screen and (max-width: 480px) {
    .input-row {
      display: block;
      margin-bottom: 10px;
    }

    .input-row select,
    .input-row input[type="text"] {
      width: 100%;
      border: 1px solid #ccc;
      padding: 5px; /* Add padding for spacing */
    }
  }
`;

const CustomerDetailsSection = styled.section`
  padding: 8px;
  background: #57facb;
  .row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 80%;
    margin: 0 auto;
  }

  .row label {
    margin-right: 20px;
  }

  .row input[type="text"],
  .row input[type="email"] {
    flex: 1;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
    margin-top: 10px;
  }

  @media screen and (max-width: 480px) {
    .customer-details-section {
      max-width: 100%;
    }

    .row label {
      flex-basis: auto;
      text-align: left;
    }
  }
`;

const AccountsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 15px;
  padding-bottom: 20px;
  background: #e7e9eb;
  .model-row {
    display: flex;
    justify-content: space-around;
  }
  .model-flex {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .model-row input,
  select {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }
  .details-row {
    display: flex;
    justify-content: space-around;
    gap: 28px;
  }
  .left-section {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 15px;
  }
  .details-input {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  #details {
    padding: 5px;
    resize: none;
  }
  .grey-highlight {
    background-color: #b9b3b3;
  }
  .total-inputs input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }
  .end-note {
    text-align: center;
  }
  .right-section {
    margin-top: 20px;
  }
  .right-section .total-inputs {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .model-flex-right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .deposits {
    margin-top: 10px;
  }

  .deposit-item {
    margin-bottom: 5px;
  }
`;

const SelectModelButton = styled.button`
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px; /* Add a little spacing to the right */
`;
