import React from 'react'
import { connect } from "react-redux"
import { Segment, Button, Transition, Header, Message, Icon, Form, List } from 'semantic-ui-react';
import { getNextLevel } from "../actions"

interface Props {
  onGetNextLevel: (uid: string, currentLvl: number) => Promise<any>
  auth: any;
  game: any;
}

interface ToTranslate {
  english: string
  french: string
}

interface State {
  current_word: ToTranslate
  pts: number
  current_try: string
  wordsFound: number
  visible: boolean
}

class GameOfWords extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      current_word: props.game.current_game?.words[0],
      pts: 10,
      current_try: '',
      visible: true,
      wordsFound: 0
    }
  }

  handleChange = (event) => {
    this.setState({
      current_try: event.target.value
    });
    event.preventDefault();
  }

  componentDidUpdate(prevProps: Props) {
    const { current_game } = this.props.game;
    if (current_game.words !== prevProps.game.current_game.words) {
        this.setState({ current_word: current_game?.words[this.state.wordsFound] });
    }
    if (current_game.lvl !== prevProps.game.current_game.lvl) {
      this.setState({
        current_word: current_game.words[0],
        pts: 10,
        current_try: '',
        visible: true,
        wordsFound: 0
      });
    }
  }

  isCurrentWordFound = () => {
    return String(this.state.current_word.english).toLowerCase() === String(this.state.current_try).toLowerCase();
  }

  resetGame = () => {
    this.setState({
      current_word: this.props.game.current_game?.words[0],
      pts: 10,
      current_try: '',
      visible: true,
      wordsFound: 0
    });
  }

  nextGame = () => {
    setTimeout(() => {
      const { uid } = this.props.auth.logged_user
      const { lvl } = this.props.game.current_game
      this.props.onGetNextLevel(uid, lvl).then(() => {
        this.setState({
          current_word: this.props.game.current_game?.words[0],
          pts: 10,
          current_try: '',
          visible: true,
          wordsFound: 0
        });
      })
    }, 3000);
  }

  handleNext = () => {
    const { current_game } = this.props.game;
    const currentGameIsWon = this.isCurrentWordFound();
    if (currentGameIsWon && this.state.pts + 1 === 20) {
      this.nextGame()
    }
    this.setState((prevState) => ({
      pts: currentGameIsWon ? this.state.pts + 1 : this.state.pts - 1,
      current_word: currentGameIsWon ? current_game?.words[prevState.wordsFound + 1] : current_game?.words[prevState.wordsFound],
      wordsFound: currentGameIsWon ? prevState.wordsFound + 1 : prevState.wordsFound,
      visible: !prevState.visible,
      current_try: ''
    }))
  }

  renderWordsProgress = () => {
    const wordList = [];
    const { wordsFound } = this.state;
    for (let i = 0; i < 10; i++) {
      let customBtn = wordsFound > i ? <Button color='teal' style={{width:'100%'}}/> : <Button color='grey' style={{width:'100%'}}/>;
      if (wordsFound === i) customBtn = <Button color='green' style={{width:'100%'}}/>;
      wordList.push(
        <List.Item key={i}>
          {customBtn}
        </List.Item>
      )
    }
    return (
      <List selection={true} horizontal={true} verticalAlign='middle'>
        {wordList}
      </List>
    )
  }

  renderGame = (currentWord: ToTranslate, visible: boolean, pts: number) => {
    return (
      <Form onSubmit={this.handleNext} size='large'>
          <Header as='h5'>You have {pts} points !</Header>
          {this.renderWordsProgress()}
          <Transition
            animation='tada'
            duration={2000}
            visible={visible}
          >
            <Segment textAlign='center'>
              <Form.Input
                autoFocus={true}
                value={this.state.current_try}
                onChange={this.handleChange}
                action={{
                  color: 'teal',
                  labelPosition: 'left',
                  icon: 'translate',
                  content: currentWord.french,
                }}
                actionPosition='left'
                placeholder='Find English Translation'
              />
              <Message>
                <Message.Header>Tip</Message.Header>
                <p>
                  The english word for <strong>{currentWord.french}</strong> starts with the letter <strong>{String(currentWord.english).charAt(0).toUpperCase()}</strong> and has <strong>{String(currentWord.english).length}</strong> letters.
                </p>
              </Message>
            </Segment>
          </Transition>
          <Button
            positive={true}
            style={{marginTop: '20px'}}
            content='Translate !'
            type='submit'
          />
      </Form>
    )
  }

  render() {
    const { current_word, visible, pts } = this.state;
    if (pts === 0 || (pts !== 20 && !current_word)) {
      return (
        <Message icon={true}>
          <Icon name='circle notched' loading={true} />
          <Message.Content>
            <Message.Header>You Failed</Message.Header>
            You failed this level ! let's try again !
          </Message.Content>
          <Button onClick={this.resetGame} positive={true}>Replay</Button>
        </Message>
      ) 
    }
    if (pts === 20) {
      return (
        <Message icon={true}>
          <Icon name='circle notched' loading={true} />
          <Message.Content>
            <Message.Header>You Won !</Message.Header>
            Level success ! Onto the next one !
          </Message.Content>
        </Message>
      ) 
    }
    if (!current_word) return null
    return this.renderGame(current_word, visible, pts);
  }

}

const mapStateToProps = state => ({
  game: state.game,
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  onGetNextLevel: (uid: string, currentLvl: number) => dispatch(getNextLevel(uid, currentLvl))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameOfWords);