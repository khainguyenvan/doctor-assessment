import React, { useState, useRef } from "react";
import useOutsideClick from "./useOutsideClick";
import "./style.css";

const DefaultToggle = React.forwardRef((props, ref) => {
  return (
    <button {...props} className="dropdown-button" ref={ref}>
      {props.title ? props.title : "Dropdown button"}
    </button>
  );
});

function Dropdown(props) {
  const [isOpen, setOpen] = useState(false);

  const wrapperRef = useRef(null);
  const dropdownBodyRef = useRef(null);
  const toggleRef = useRef(null);

  useOutsideClick(wrapperRef, () => {
    setOpen(false);
  });

  const handleShowDropdown = (e) => {
    setOpen(!isOpen);
  };

  const options = props.options;
  const currentSelected = options.find((opt) => opt.isSelected === true);

  const handleOnClick = (name) => (e) => {
    if (props.onSelect) {
      props.onSelect(name);
    }
    setOpen(false);
  };
  return (
    <div className="dropdown-container" ref={wrapperRef}>
      {props.customToggle ? (
        React.cloneElement(props.customToggle(), {
          ...props.customToggle().props,
          onClick: handleShowDropdown,
          ref: toggleRef,
        })
      ) : (
        <DefaultToggle
          title={currentSelected.name}
          onClick={handleShowDropdown}
          ref={toggleRef}
        />
      )}
      <ul
        className={`dropdown ${isOpen ? "dropdown-open" : ""}`}
        ref={dropdownBodyRef}
      >
        {options.map((opt, i) => {
          const active = opt.isSelected;

          return (
            <li
              key={`${opt.name}-${i}`}
              className="dropdown-item"
              onClick={handleOnClick(opt)}
            >
              <div
                className={`circle-with-check ${active ? "active" : ""}`}
              ></div>
              <span>{opt.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
export default Dropdown;
