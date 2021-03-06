import React from "react";
import styled from "styled-components";
import metroLogo from "../assets/metro.svg";

// 736
const deviceWidth = "541px";

export const Input = styled.input`
  border: 3px solid rgba(200, 200, 200, 0.3);
  min-height: 21px;
  @media (max-width: ${deviceWidth}) {
    width: 100%;
  }
`;

export const Label = styled.div`
  display: flex;
  padding: 1px;
  @media (max-width: ${deviceWidth}) {
    min-width: 100%;
  }
`;

export const FormLabel = styled.label`
  text-transform: uppercase;
  /* min-height: 32px; */
  background: ${props => (props.noBg ? "initial" : "#fafafa")};
  @media (max-width: ${deviceWidth}) {
    min-width: 66px;
  }
  color: #000;
  padding: 2px 5px;
`;

export const AddressForm = styled.form`
  display: flex;
  min-height: 32px;
  @media (max-width: ${deviceWidth}) {
    min-height: 66px;
  }
  flex-wrap: wrap;
  padding-top: 20px;
`;

export const Button = styled.button`
  text-transform: uppercase;
  min-height: 30px;
  background: #fff;
  border: 3px solid blue;
  padding: 7px;
  margin: 10px;
  min-width: 50px;
`;

export const AlertWrapper = styled.div`
  min-height: 171px;
  @media (max-width: ${deviceWidth}) {
    width: 100%;
  }
  width: fit-content;
`;

export const Alert = styled.div`
  min-height: 160px;
  border: 3px dashed blue;
  width: 450px;
  @media (max-width: ${deviceWidth}) {
    width: 100%;
  }
  opacity: 1;
  display: flex;
  display: ${props => (props.shouldDisplay ? "flex" : "none")};
  box-sizing: border-box;
  padding: 20px;
  flex-direction: column;

  animation: keyframes 1s;

  @keyframes keyframes {
    from {
      opacity: 0.01;
    }
    to {
      opacity: 1;
    }
  }
`;

export const H3 = styled.h3`
  padding: 0px;
  margin: 0px;
  align-self: center;
  padding-left: 10px;
`;

export const H5 = styled.h5`
  margin: 10px 0;
`;

const TrainItemInner = styled.button`
  border: ${props => (props.selected ? "3px solid blue" : "none")};
  width: 450px;
  @media (max-width: ${deviceWidth}) {
    width: 100%;
  }
  display: flex;

  /* width: 100%; */
  background: #fff;
  box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.3);
  padding: 10px;
  list-style: none;
`;
export const TrainItem = props => (
  <TrainItemInner {...props}>
    <img alt={""} src={metroLogo} width={25} height={25} />
    <H3>{props.children}</H3>
  </TrainItemInner>
);
export const TrainList = styled.ul`
  @media (max-width: ${deviceWidth}) {
    width: 100%;
  }

  overflow: auto;
  margin: 20px 0px;
  padding: 0;
`;

export const AppTitle = styled.h1`
  padding: 10px 20px 0px 20px;
  margin: 0;
`;

export const RoundedElipsis = styled.div`
  justify-content: ${props => (props.disabled ? "flex-start" : "flex-end")};
  display: flex;
  background-color: #d5d5d5;
  border-radius: 25px;
  height: 28px;
  width: 50px;
  padding: 0px 3px;
  align-self: center;

  div {
    background-color: ${props => (props.disabled ? "#f9f9f9" : "blue")};
  }
`;
export const Toggle = styled.div`
  align-self: center;
  background-color: blue;
  border-radius: 50%;
  height: 24px;
  width: 24px;
`;

export const Flex = styled.div`
  display: flex;
`;

export const MarginAuto = styled.div`
  margin: auto 0px 0px 0px;
`;
