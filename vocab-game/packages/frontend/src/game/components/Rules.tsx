import React, { Component } from 'react'
import { Button, Header, Icon, Modal, Divider, List } from 'semantic-ui-react'

interface Props {
  userName: string
  lvl: number
}

export default class RulesModal extends Component<Props> {
  state = { modalOpen: this.props.lvl === 0 ? true : false }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  render() {
    return (
      <Modal
        open={this.state.modalOpen}
        onClose={this.handleClose}
        size='small'
      >
        <Header as='h1'>Welcome {this.props.userName}</Header>
        <Modal.Content>
          <Header textAlign='center' as='h3'>In this game you have to translate French words to English</Header>
          <Divider inverted={true} section={true} />
          <List bulleted={true} size='big'>
            <List.Item>
              <Header as='h4'>You start with 10pts and earn 1pt for each word you find</Header>
            </List.Item>
            <List.Item>
              <Header as='h4'>You loose 1pt per failed word translation</Header>
            </List.Item>
            <List.Item>
              <Header as='h4'>You need to find 10 words in a row to complete the level</Header>
            </List.Item>
          </List>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.handleClose} inverted={true}>
            <Icon name='checkmark' /> Got it
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}