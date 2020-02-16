import React from "react";
import { action } from "@storybook/addon-actions";
import Button, { ButtonAppearance, ButtonSize } from "./Button";

export const SimpleUsage = () => {
  return (
    <div className="margin-btns">
      <Button size={ButtonSize.SMALL} onClick={action("clicked")}>
        SMALL
      </Button>
      <Button size={ButtonSize.MEDIUM} onClick={action("clicked")}>
        MEDIUM
      </Button>
      <Button size={ButtonSize.LARGE} onClick={action("clicked")}>
        LARGE
      </Button>
    </div>
  );
};

SimpleUsage.story = {
  parameters: {
    docs: {
      storyDescription: "Depicts a simple usage of the button",
    },
  },
};

export const PrimaryButton = () => {
  return (
    <div className="margin-btns">
      <Button
        appearance={ButtonAppearance.PRIMARY}
        size={ButtonSize.SMALL}
        onClick={action("clicked")}
      >
        SMALL
      </Button>
      <Button
        appearance={ButtonAppearance.PRIMARY}
        size={ButtonSize.MEDIUM}
        onClick={action("clicked")}
      >
        MEDIUM
      </Button>
      <Button
        appearance={ButtonAppearance.PRIMARY}
        size={ButtonSize.LARGE}
        onClick={action("clicked")}
      >
        LARGE
      </Button>
    </div>
  );
};

PrimaryButton.story = {
  parameters: {
    docs: {
      storyDescription: "Depicts a primary button",
    },
  },
};

export const SecondaryButton = () => {
  return (
    <div className="margin-btns">
      <Button
        appearance={ButtonAppearance.SECONDARY}
        size={ButtonSize.SMALL}
        onClick={action("clicked")}
      >
        SMALL
      </Button>
      <Button
        appearance={ButtonAppearance.SECONDARY}
        size={ButtonSize.MEDIUM}
        onClick={action("clicked")}
      >
        MEDIUM
      </Button>
      <Button
        appearance={ButtonAppearance.SECONDARY}
        size={ButtonSize.LARGE}
        onClick={action("clicked")}
      >
        LARGE
      </Button>
    </div>
  );
};

SecondaryButton.story = {
  parameters: {
    docs: {
      storyDescription: "Depicts a secondary button",
    },
  },
};

export default {
    title: "Button",
};
