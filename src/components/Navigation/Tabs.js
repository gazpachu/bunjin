import React, { Component } from "react";
import { Form, FormInput, Button } from "../../common/common.styles";
import { AuthUserContext } from "../Session";
import { withFirebase } from "../Firebase";
import Tab from "./Tab";

class Tabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      loading: false,
      tabs: [],
      limit: 5
    };
  }

  componentDidMount() {
    this.onListenForTabs();
  }

  onListenForTabs = () => {
    this.setState({ loading: true });

    this.unsubscribe = this.props.firebase
      .tabs()
      .orderBy("createdAt", "desc")
      .limit(this.state.limit)
      .onSnapshot(snapshot => {
        if (snapshot.size) {
          let tabs = [];
          snapshot.forEach(doc => tabs.push({ ...doc.data(), uid: doc.id }));

          this.setState({
            tabs: tabs.reverse(),
            loading: false
          });
        } else {
          this.setState({ tabs: null, loading: false });
        }
      });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChangeText = event => {
    this.setState({ text: event.target.value });
  };

  onCreateTab = (event, authUser) => {
    this.props.firebase.tabs().add({
      text: this.state.text,
      userId: authUser.uid,
      createdAt: this.props.firebase.fieldValue.serverTimestamp()
    });

    this.setState({ text: "" });

    event.preventDefault();
  };

  onEditTab = (tab, text) => {
    const { uid, ...tabSnapshot } = tab;

    this.props.firebase.tab(tab.uid).update({
      ...tabSnapshot,
      text,
      editedAt: this.props.firebase.fieldValue.serverTimestamp()
    });
  };

  onRemoveTab = uid => {
    this.props.firebase.tab(uid).delete();
  };

  onNextPage = () => {
    this.setState(state => ({ limit: state.limit + 5 }), this.onListenForFeeds);
  };

  render() {
    const { text, tabs, loading } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {!loading && tabs && (
              <Button type="button" onClick={this.onNextPage}>
                More
              </Button>
            )}

            {loading && <div>Loading ...</div>}

            {tabs && (
              <ul>
                {tabs.map(tab => (
                  <Tab
                    authUser={authUser}
                    key={tab.uid}
                    tab={tab}
                    onEditTab={this.onEditTab}
                    onRemoveTab={this.onRemoveTab}
                  />
                ))}
              </ul>
            )}

            {!tabs && <div>There are no tabs ...</div>}

            <Form onSubmit={event => this.onCreateTabb(event, authUser)}>
              <FormInput
                type="text"
                value={text}
                onChange={this.onChangeText}
              />
              <Button type="submit">Send</Button>
            </Form>
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(Tabs);
