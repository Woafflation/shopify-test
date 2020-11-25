import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "@shopify/polaris";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import ShopForm from "./components/shop-form";

import logo from "./assets/icons/logo.svg";
import phoneImg from "./assets/images/phone.png";
import dividerImg from "./assets/images/divider.svg";
import arrowIcon from "./assets/icons/arrow.svg";
import downloadImg from "./assets/images/download.svg";

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  padding: 35px 0 0 0;
`;
const Header = styled.div`
  padding-left: 130px;
`;
const Image = styled.img``;
const Divider = styled.img`
  margin-top: 55px;
  margin-bottom: 85px;
  margin-right: 60px;
`;
const PhoneImage = styled.img`
  width: 555px;
  height: 898px;
  margin-top: 85px;
`;
const Content = styled.div`
  display: flex;
`;
const ColumnContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 140px;
`;
const DownloadTitle = styled.div`
  font-size: 26px;
  line-height: 32px;
  letter-spacing: 0px;
  text-align: left;
  color: #212b36;
  margin-bottom: 35px;
`;
const DownloadDescription = styled.div`
  max-width: 600px;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;
  text-align: left;
  color: #212b36;
  margin-bottom: 15px;
`;
const HelperText = styled.div`
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;
  text-align: left;
  color: #919eab;
`;
const ButtonWrapper = styled.div`
  width: 170px;
  margin-top: 15px;
  margin-bottom: 45px;
`;
const ArrowImage = styled.img`
  margin-top: 8px;
  margin-bottom: 15px;
`;
const UploadImage = styled.img``;
const UploadImageWrapper = styled.div`
  border: 1px solid #919eab;
  padding: 28px 18px 35px 32px;
`;

const exportToJson = (objectData) => {
  let filename = "export.json";
  let contentType = "application/json;charset=utf-8;";
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    let blob = new Blob(
      [decodeURIComponent(encodeURI(JSON.stringify(objectData, null, 2)))],
      { type: contentType }
    );
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    let a = document.createElement("a");
    a.download = filename;
    a.href =
      "data:" +
      contentType +
      "," +
      encodeURIComponent(JSON.stringify(objectData));
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

const App = () => {
  const [fileData, setFileData] = useState({});

  const handleDownloadClick = () => {
    exportToJson(fileData);
  };

  return (
    <Router>
      <Wrapper>
        <Header>
          <Image src={logo} alt="" />
        </Header>
        <Switch>
          <Route exact path="/">
            <Content>
              <PhoneImage src={phoneImg} alt="" />
              <Divider src={dividerImg} alt="" />
              <ShopForm setFileData={setFileData} />
            </Content>
          </Route>
          <Route exact path="/download">
            <ColumnContent>
              <DownloadTitle>Start customizing your shop</DownloadTitle>
              <DownloadDescription>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Odio
                egestas euismod est pharetra pharetra, pellentesque lacus
                interdum posuere. Ultricies lacus, eu justo nulla diam tempor.
              </DownloadDescription>
              <DownloadDescription>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Odio
                egestas euismod est pharetra pharetra, pellentesque lacus
                interdum posuere. Ultricies lacus, eu justo nulla diam tempor.
              </DownloadDescription>
              <ButtonWrapper>
                <Button onClick={handleDownloadClick} fullWidth primary>
                  Download file
                </Button>
              </ButtonWrapper>
              <HelperText>Then upload this file here</HelperText>
              <ArrowImage src={arrowIcon} alt="arrow" />
              <UploadImageWrapper>
                <UploadImage src={downloadImg} alt="upload" />
              </UploadImageWrapper>
            </ColumnContent>
          </Route>
          <Route
            exact
            path="/faq"
            render={() => {
              window.location =
                "https://shopify.dev/docs/storefront-api/getting-started#storefront-api-authentication";
            }}
          />
        </Switch>
      </Wrapper>
    </Router>
  );
};

export default App;
