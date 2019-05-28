import { getPoly } from 'util/polyglot';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ChatActions from 'actions/chat';
import * as ProfileActions from 'actions/profile';
import { getConvos } from 'reducers/chat';
import IosClose from 'react-ionicons/lib/IosClose';
import ChatHead from 'components/chat/ChatHead';
import ChatConvo from 'components/chat/ChatConvo';
import './Chat.scss';

class Chat extends Component {
  state = {
    oldActiveConvo: null,
  };

  constructor(props) {
    super(props);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleRetryConvosClick = this.handleRetryConvosClick.bind(this);
    this.handleChatHeadClick = this.handleChatHeadClick.bind(this);
    this.handleConvoCloseClick = this.handleConvoCloseClick.bind(this);
  }

  componentDidMount() {
    if (this.props.convos.length) {
      this.getConvoProfiles();

      if (!this.props.activeConvo) {
        this.activateFirstConvo();
      }
    }

    this.props.actions.convosRequest();
  }

  componentDidUpdate(prevProps) {
    if (
      !prevProps.convos ||
      !prevProps.convos.length
    ) {
      this.getConvoProfiles();
      
      if (!this.props.activeConvo) {
        this.activateFirstConvo();
      }
    }

    if (
      prevProps.activeConvo &&
      !this.props.activeConvo &&
      !(
        this.state.oldActiveConvo &&
        this.state.oldActiveConvo.peerId ===
          prevProps.peerId
      )
    ) {
      // The oldActiveConvo is kept around so that the chat convo
      // component will visually remain in the UI as it slides down.
      this.setState({ oldActiveConvo: prevProps.activeConvo });
    }
  }

  handleRetryConvosClick() {
    this.props.actions.convosRequest();
  }

  handleCloseClick() {
    this.props.actions.close();
  }

  handleChatHeadClick(peerId) {
    this.props.actions.activateConvo(peerId);
  }

  handleConvoCloseClick() {
    this.props.actions.deactivateConvo();
  }

  activateFirstConvo() {
    if (this.props.convos && this.props.convos.length) {
      this.props.actions.activateConvo(this.props.convos[0].peerId);
    }
  }

  getConvoProfiles() {
    this.props.convos.forEach(convo =>
      this.props.actions.profile.requestCached({ peerId: convo.peerId }))
  }

  render() {
    let convos = null;

    if (this.props.convosFetchFailed) {
      convos = (
        <div className="row">
          <div className="clrTErr row">
            {
              this.props.convosFetchError ?
                getPoly().t('chat.fetchConvosError', { error: this.props.convosFetchError }) :
                getPoly().t('chat.fetchConvosErrorGeneric')
            }
          </div>
          <div className="txCtr">
            <button className="btn clrP" onClick={this.handleRetryConvosClick}>
              {getPoly().t('chat.btnRetryConvos')}
            </button>
          </div>
        </div>
      );
    } else {
      convos = (
        <div className="gutterVSm">
          {
            this.props.convos
              // .concat(this.props.convos)
              // .concat(this.props.convos)
              // .concat(this.props.convos)
              // .concat(this.props.convos)
              // .concat(this.props.convos)
              // .concat(this.props.convos)
              // .concat(this.props.convos)
              .map(convo => {
                const selected =
                  this.props.activeConvo &&
                  this.props.activeConvo.peerId=== convo.peerId;

                return (
                  <ChatHead {...convo}
                    key={convo.peerId}
                    selected={selected}
                    onClick={() => this.handleChatHeadClick(convo.peerId)}
                    profile={this.props.profile[convo.peerId] || null} 
                  />
                );
              })
          }
        </div>        
      );
    }

    let chatConvo;
    const convoData = this.props.activeConvo || this.state.oldActiveConvo;

    if (this.props.activeConvo || this.state.oldActiveConvo) {
      chatConvo = (
        <ChatConvo
          {...convoData}
          onClick={this.props.activeConvo ? this.handleConvoCloseClick : null}
          profile={this.props.profile[convoData.peerId]}
        />
      );
    }

    const chatConvoWrapOpenClass = this.props.activeConvo ? 'open' : '';

    return (
      <div className="Chat tx6">
        <button
          className="Chat-btnClose border clrBr clrP"
          onClick={this.handleCloseClick}
        >
          <IosClose fontSize="30px" />
        </button>
        <div className="Chat-chatHeads border padSm clrBr clrP">{convos}</div>
        <div className={`Chat-chatConvoWrap ${chatConvoWrapOpenClass}`}>
          {chatConvo}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, prop) {
  return {
    ...state.chat,
    convos: getConvos(state.chat),
    profile: state.profile,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      ...bindActionCreators(ChatActions, dispatch),
      profile: bindActionCreators(ProfileActions, dispatch),
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);

// export default Chat;
