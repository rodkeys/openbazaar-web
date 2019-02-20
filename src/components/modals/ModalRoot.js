import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ModalActions from 'actions/modals';
import './ModalRoot.scss';

class ModalRoot extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.processProps(props);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleEscKeyUp = this.handleEscKeyUp.bind(this);
  }

  processProps(props = {}) {
    import(`../../${props.path}`).then(
      ModalModule => {
        if (this.state.ModalComponent) return;
        this.setState({ ModalComponent: ModalModule.default });
      },
      error => console.error('There was an error loading the modal', error)
    );
  }

  handleCloseClick() {
    this.close();
  }

  handleEscKeyUp(e) {
    if (e.keyCode !== 27) return;

    const topModal = this.props.modals.openModals[
      this.props.modals.openModals.length - 1
    ];

    if (topModal && topModal.id === this.props.id) {
      setTimeout(() => this.close());
    }
  }

  close() {
    this.props.actions.close({ id: this.props.id });
  }

  componentDidMount() {
    document.addEventListener('keyup', this.handleEscKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleEscKeyUp);
  }

  render() {
    if (!this.state.ModalComponent) return null;

    const modalProps = { ...this.props };
    delete modalProps.type;

    return (
      <section className="ModalRoot">
        <div className="ModalRoot-innerWrap">
          <button className="ModalRoot-close" onClick={this.handleCloseClick}>
            X
          </button>
          <this.state.ModalComponent {...modalProps} />
        </div>
      </section>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    modals: state.modals
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ModalActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalRoot);
