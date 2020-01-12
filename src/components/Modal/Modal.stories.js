import React, { useRef } from "react";
import Modal from "./Modal";

const ModalExample = () => {
  return (
    <Modal isOpen={true} title="This is the header">
      <div>From inside a modal</div>
    </Modal>
  );
};

const ModalClickExample = () => {
  const modalRef = useRef();
  const showModal = () => {
    modalRef.current.showModal();
  };

  return (
    <div>
      <a href="javascript:void(0)" onClick={showModal}>
        Show Modal
      </a>
      <Modal title="This is the header" ref={modalRef}>
        <div>From inside a modal</div>
      </Modal>
    </div>
  );
};

export default {
  title: "Modal",

  parameters: {
    info: {
      propTables: [Modal],
      propTablesExclude: [ModalExample, ModalClickExample],
    },
  },
};

export const ActivateOnClick = () => {
  return <ModalClickExample />;
};

ActivateOnClick.story = {
  name: "Activate on click",
};

export const OpenByDefault = () => {
  return <ModalExample />;
};

OpenByDefault.story = {
  name: "Open by default",
};
