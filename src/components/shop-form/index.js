import React, { useState, useCallback } from "react";
import styled from "styled-components";
import {
  Form,
  FormLayout,
  TextField,
  Button,
  Checkbox,
  SkeletonBodyText,
  TextStyle,
} from "@shopify/polaris";
import { useHistory } from "react-router-dom";

import { layoutScreens } from "./consts";

import successIcon from "../../assets/icons/success.svg";
import errorIcon from "../../assets/icons/error.svg";

const Wrapper = styled.div``;
const Title = styled.div`
  font-size: 26px;
  line-height: 32px;
  margin-bottom: 40px;
`;
const RowWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ mb }) => mb}px;
`;
const HelperTextWrapper = styled.div`
  margin-left: 15px;
`;
const HelperImage = styled.img`
  margin-right: 8px;
`;
const TextFieldWrapper = styled.div`
  width: 280px;
  margin-right: ${({ mr }) => mr}px;
  position: relative;
`;
const ButtonWrapper = styled.div`
  width: 118px;
`;
const FormWrapper = styled.div`
  margin-top: 40px;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
`;
const CheckboxGroup = styled.div`
  display: flex;
  flex-flow: column wrap;
  max-height: 120px;
`;
const CheckboxWrapper = styled.div`
  margin-bottom: 10px;
  flex: 0 1 20px;
`;
const GroupTitle = styled.div``;
const LayoutGroup = styled.div`
  max-width: 600px;
  display: flex;
  flex-flow: row wrap;
`;
const LayoutWrapper = styled.div`
  display: flex;
  width: 115px;
  flex-direction: column;
  align-items: center;
  margin-right: ${({ isFourth }) => (isFourth ? 0 : 46)}px;
  margin-bottom: 20px;
  cursor: ${({ isDisabled }) => !isDisabled && "pointer"};
`;
const LayoutImageWrapper = styled.div`
  height: 214px;
  width: 115px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ isActive }) => (isActive ? "#212B36" : "#F0F0F0")};
  border-radius: 14px;
`;
const LayoutTitle = styled.div`
  margin-top: 5px;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;
  text-align: center;
  color: #5f6dc6;
`;
const ApiKeyLink = styled.div`
  position: absolute;
  right: 0;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: 0px;
  text-align: left;
  color: #5f6dc6;
  cursor: pointer;
`;

const initialShopState = {
  storeUrl: "",
  apiKey: "",
};
const initialInfoState = {
  firstName: "",
  lastName: "",
  email: "",
  shopName: "",
  storeCollections: [],
  layoutType: "",
};

const ShopForm = ({ setFileData }) => {
  const [shopState, setShopState] = useState(initialShopState);
  const [infoState, setInfoState] = useState(initialInfoState);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isTouched, setIsTouched] = useState(false);
  const [error, setError] = useState("");
  const [collectionsResp, setCollectionsResp] = useState([]);
  const history = useHistory();

  const handleCheckSubmit = useCallback(
    (_event) => {
      const headers = new Headers();
      headers.append("Authorization", `Basic ${btoa(shopState.apiKey)}`);
      fetch(
        `https://${shopState.storeUrl}/api/apps/8/collection_listings.json?limit=250`,
        {
          headers,
        }
      )
        .then((item) => item.json())
        .then((item) => {
          setIsTouched(true);
          if (item) {
            setCollectionsResp(item["collection_listings"]);
            setIsDisabled(false);
          }
        })
        .catch((item) => {
          setIsTouched(true);
          setError(item);
        });
    },
    [shopState.apiKey, shopState.storeUrl]
  );

  const handleSubmit = useCallback(
    (_event) => {
      setFileData({
        ...shopState,
        ...infoState,
      });
      history.push("/download");
    },
    [setFileData, shopState, infoState]
  );

  const handleShopValueChange = (value, key) =>
    setShopState({
      ...shopState,
      [key]: value,
    });

  const handleInfoValueChange = (value, key) =>
    setInfoState({
      ...infoState,
      [key]: value,
    });

  const handleCheckboxChange = (newChecked, id) => {
    if (newChecked) {
      setInfoState({
        ...infoState,
        storeCollections: [...infoState.storeCollections, id],
      });
    } else {
      setInfoState({
        ...infoState,
        storeCollections: infoState.storeCollections.filter(
          (item) => item !== id
        ),
      });
    }
  };

  const handleLayoutChange = (id) => {
    if (infoState.layoutType === id) {
      setInfoState({ ...infoState, layoutType: "" });
    } else {
      setInfoState({
        ...infoState,
        layoutType: id,
      });
    }
  };

  return (
    <Wrapper>
      <Title>Start customizing your shop</Title>
      <Form onSubmit={handleCheckSubmit}>
        <FormLayout>
          <RowWrapper>
            <TextFieldWrapper mr={40}>
              <TextField
                value={shopState.storeUrl}
                onChange={(e) => handleShopValueChange(e, "storeUrl")}
                label="Store URL"
                placeholder="Enter URL"
              />
            </TextFieldWrapper>
            <TextFieldWrapper>
              <ApiKeyLink onClick={() => history.push("/faq")}>
                Where to find the api key?
              </ApiKeyLink>
              <TextField
                value={shopState.apiKey}
                onChange={(e) => handleShopValueChange(e, "apiKey")}
                label="API key"
                placeholder="Enter API key"
              />
            </TextFieldWrapper>
          </RowWrapper>
          <RowWrapper>
            <ButtonWrapper>
              <Button fullWidth submit>
                Check
              </Button>
            </ButtonWrapper>
            {isTouched && (
              <HelperTextWrapper>
                <HelperImage
                  src={!isDisabled ? successIcon : errorIcon}
                  alt=""
                />
                <TextStyle variation={!isDisabled ? "positive" : "negative"}>
                  {!isDisabled
                    ? "Successfully"
                    : `Shopify returned error: ${error}`}
                </TextStyle>
              </HelperTextWrapper>
            )}
          </RowWrapper>
        </FormLayout>
      </Form>
      <FormWrapper isDisabled={isDisabled}>
        <Form onSubmit={handleSubmit}>
          <FormLayout>
            <RowWrapper mb={25}>
              <TextFieldWrapper mr={40}>
                <TextField
                  disabled={isDisabled}
                  value={infoState.firstName}
                  onChange={(e) => handleInfoValueChange(e, "firstName")}
                  label="First Name"
                  placeholder="Enter First Name"
                />
              </TextFieldWrapper>
              <TextFieldWrapper>
                <TextField
                  disabled={isDisabled}
                  value={infoState.lastName}
                  onChange={(e) => handleInfoValueChange(e, "lastName")}
                  label="Last Name"
                  placeholder="Enter Last Name"
                />
              </TextFieldWrapper>
            </RowWrapper>
            <RowWrapper mb={25}>
              <TextFieldWrapper mr={40}>
                <TextField
                  disabled={isDisabled}
                  value={infoState.email}
                  onChange={(e) => handleInfoValueChange(e, "email")}
                  label="Email address"
                  placeholder="Enter email address"
                  type="email"
                />
              </TextFieldWrapper>
              <TextFieldWrapper>
                <TextField
                  disabled={isDisabled}
                  value={infoState.shopName}
                  onChange={(e) => handleInfoValueChange(e, "shopName")}
                  label="Name your shop"
                  placeholder="Enter shop name"
                />
              </TextFieldWrapper>
            </RowWrapper>
            <GroupTitle>Store Collections</GroupTitle>
            <CheckboxGroup>
              {collectionsResp.length > 0 ? (
                collectionsResp.map(({ collection_id: id, title }) => (
                  <CheckboxWrapper key={id}>
                    <Checkbox
                      checked={infoState.storeCollections.includes(id)}
                      onChange={(newChecked) =>
                        handleCheckboxChange(newChecked, id)
                      }
                      disabled={isDisabled}
                      label={title}
                    />
                  </CheckboxWrapper>
                ))
              ) : (
                <SkeletonBodyText lines={2} />
              )}
            </CheckboxGroup>
            <GroupTitle>Select layout</GroupTitle>
            <LayoutGroup>
              {layoutScreens.map((item, index) => (
                <LayoutWrapper
                  onClick={() => !isDisabled && handleLayoutChange(item.id)}
                  isFourth={index === 3}
                  key={item.id}
                  isDisabled={isDisabled}
                >
                  <LayoutImageWrapper
                    isActive={infoState.layoutType === item.id}
                  >
                    <img src={item.img} alt={item.id} />
                  </LayoutImageWrapper>
                  <LayoutTitle>{item.title}</LayoutTitle>
                </LayoutWrapper>
              ))}
            </LayoutGroup>
            <ButtonWrapper>
              <Button disabled={isDisabled} fullWidth submit primary>
                Continue
              </Button>
            </ButtonWrapper>
          </FormLayout>
        </Form>
      </FormWrapper>
    </Wrapper>
  );
};

export default ShopForm;
