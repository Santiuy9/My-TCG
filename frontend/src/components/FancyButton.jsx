import React from "react"
import PropTypes from "prop-types"
import "./css/FancyButton.css"

const FancyButton = ({ children, variant = "primary", size = "medium", onClick, disabled = false }) => {
  return (
    <button className={`fancy-button ${variant} ${size}`} onClick={onClick} disabled={disabled}>
      <span className="button-text">{children}</span>
      <span className="button-effect"></span>
    </button>
  )
}

FancyButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "success", "danger"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
}

export default FancyButton

