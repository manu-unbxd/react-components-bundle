import React from "react";
import NotificationComponent from "./NotificationComponent";

export default {
  title: "NotificationComponent",
};

export const SimpleUsage = () => {
  return (
    <div>
      <NotificationComponent appearance="success" messageId={1}>
        Data loaded successfully
      </NotificationComponent>
      <br />
      <NotificationComponent appearance="error" messageId={2}>
        Some error occured
      </NotificationComponent>
      <br />
      <NotificationComponent appearance="warning" messageId={3}>
        Doing this operation will erase all your data
      </NotificationComponent>
      <br />
      <NotificationComponent appearance="info" messageId={4}>
        The job is scheduled. You will get a notification once it is completed.
      </NotificationComponent>
    </div>
  );
};
