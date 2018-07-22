import React from "react";
import { colors } from "./utils"

export default class Cell extends React.PureComponent {
  backgroundColor() {
    if (this.props.showAsSelected) {
      return this.props.cellIsChallenge ? colors.correct : colors.wrong;
    }

    if (this.props.showAsChallenge) {
      return colors.challenge;
    }
    return colors.available;
  }
  handleClick = () => {
    this.props.onClick(this.props.id);
  }
  render() {
    return (
      <div className="cell" onClick={this.handleClick} style={{ width: `${this.props.cellWidth - 0.16}%`, backgroundColor: this.backgroundColor() }} />
    );
  }
}
