import React from "react";
import styled from "styled-components";
import metroLogo from "../assets/metro.svg";
// yes, i'm that lazy
import { lighten } from "polished";

export const Input = styled.input`
  border: 3px solid rgba(200, 200, 200, 0.3);
  @media (max-width: 541px) {
    width: 100%;
  }
`;

export const Label = styled.label`
  display: flex;
  padding: 1px;
  @media (max-width: 541px) {
    min-width: 100%;
  }
`;

export const FormLabel = styled.label`
  text-transform: uppercase;
  background: #fafafa;
  @media (max-width: 541px) {
    min-width: 66px;
  }
  color: #000;
  padding: 5px;
`;

export const AddressForm = styled.form`
  display: flex;
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

export const Alert = styled.div`
  border: 3px dashed blue;
  width: 450px;
  @media (max-width: 541px) {
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
  @media (max-width: 541px) {
    width: 100%;
  }
  display: flex;
  /* width: 100%; */
  background: #fff;
  box-shadow: ${props =>
    !props.selected ? "0 3px 1px rgba(0, 0, 0, 0.3)" : null};
  padding: 10px;
  list-style: none;
`;
export const TrainItem = props => (
  <TrainItemInner {...props}>
    <img src={metroLogo} width={25} height={25} />
    <H3>{props.children}</H3>
  </TrainItemInner>
);
export const TrainList = styled.ul`
  padding: 20px 0px;
  margin: 0;
`;

export const AppTitle = styled.h1`
  padding: 10px 20px 0px 20px;
  margin: 0;
`;
