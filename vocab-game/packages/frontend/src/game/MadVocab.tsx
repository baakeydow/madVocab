import React from 'react'
import { connect } from "react-redux"
import { Container, Header, Grid, Message, Icon } from 'semantic-ui-react'
import { getGameLevels, getGameWords } from './actions';
import LevelList from './components/Level';
import Rules from './components/Rules';
import GameOfWords from './components/GameOfWords';
import './game.scss';

interface Props {
  onGetGameLevels: () => Promise<any>
  onGetGameWords: (uid: string) => Promise<any>
  auth: any;
  game: any;
}

class MadVocab extends React.Component<Props> {

  constructor(props: Props) {
    super(props);
    props.onGetGameLevels();
    props.onGetGameWords(props.auth.logged_user?.uid);
  }

  render() {
    const { logged_user } = this.props.auth;
    const { current_game } = this.props.game;
    if (!current_game.words?.length) {
      return (
        <Message icon={true}>
          <Icon name='circle notched' loading={true} />
            <Header>No Words available ! Is the game correctly configured ?</Header>
        </Message>
      )
    }
    return (
      <Container className="MadVocabGame">
        <Rules userName={logged_user?.username} lvl={current_game.lvl}/>
        <Grid divided='vertically' style={{marginTop:'20px'}}>
          <Header icon='universal access' as='h1' content='Select Level'/>
          <Grid.Row style={{minHeight:'20vh', maxHeight:'20vh', overflowY:'auto', marginBottom: '40px', padding: '1em'}} columns={1} textAlign='justified'>
            <Grid.Column>
              <LevelList/>
            </Grid.Column>
          </Grid.Row>
          <Header icon='game' as='h1' content='Play !'/>
          <Grid.Row columns={1}>
            <Grid.Column>
              <GameOfWords/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  game: state.game,
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  onGetGameLevels: () => dispatch(getGameLevels()),
  onGetGameWords: (uid: string) => dispatch(getGameWords(uid))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MadVocab);
