import React from "react";
import {
  AddressForm as AddressForm_,
  Alert,
  Input,
  TrainItem,
  TrainList as TrainList_,
  Button,
  Label,
  AppTitle,
  FormLabel,
  H5,
  RoundedElipsis,
  Toggle,
  Flex,
  MarginAuto,
  AlertWrapper
} from "./StyledComponents";

export const AddressForm = () => (
  <AddressForm_>
    <Label>
      <FormLabel>From</FormLabel>
      <Input />
    </Label>

    <Label>
      <FormLabel>To</FormLabel>
      <Input />
    </Label>
  </AddressForm_>
);

export const Reminder = ({ time, clean = () => {}, disable = () => {} }) => (
  <AlertWrapper>
    <Alert shouldDisplay={!!time}>
      <div>
        <H5>ALERT</H5>
        {time} minutes to go
      </div>
      <div>
        <Button onClick={clean}>X</Button>
        <Button onClick={disable}>disable</Button>
      </div>
    </Alert>
  </AlertWrapper>
);

export const TrainList = ({ items = [], selected = 0, onClick = a => {} }) => (
  <TrainList_>
    {items.map((item, i) => (
      <TrainItem
        onClick={() => onClick(i)}
        key={item}
        selected={selected === i}
      >
        {item}
      </TrainItem>
    ))}
  </TrainList_>
);

export const ReminderToggle = ({ state, onClick = () => {} }) => (
  <RoundedElipsis onClick={onClick} disabled={state !== "enabled"}>
    <Toggle />
  </RoundedElipsis>
);

export const BottomReminderToggle = ({ onClick = () => {}, state }) => (
  <MarginAuto>
    <Flex>
      <FormLabel noBg={true}>Reminders</FormLabel>{" "}
      <ReminderToggle onClick={onClick} state={state} />
    </Flex>
  </MarginAuto>
);
