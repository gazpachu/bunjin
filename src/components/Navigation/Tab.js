import React, { Component } from "react";
import { FormInput, Button } from "../../common/common.styles";

class Tab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.tab.text
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.tab.text
    }));
  };

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditTab(this.props.tab, this.state.editText);

    this.setState({ editMode: false });
  };

  render() {
    const { authUser, tab, onRemoveTab } = this.props;
    const { editMode, editText } = this.state;

    return (
      <li>
        {editMode ? (
          <FormInput
            type="text"
            value={editText}
            onChange={this.onChangeEditText}
          />
        ) : (
          <span>
            <strong>{tab.userId}</strong> {tab.text}
            {tab.editedAt && <span>(Edited)</span>}
          </span>
        )}

        {authUser.uid === tab.userId && (
          <span>
            {editMode ? (
              <span>
                <Button onClick={this.onSaveEditText}>Save</Button>
                <Button onClick={this.onToggleEditMode}>Cancel</Button>
              </span>
            ) : (
              <Button onClick={this.onToggleEditMode}>Edit</Button>
            )}

            {!editMode && (
              <Button type="button" onClick={() => onRemoveTab(tab.uid)}>
                Delete
              </Button>
            )}
          </span>
        )}
      </li>
    );
  }
}

export default Tab;
