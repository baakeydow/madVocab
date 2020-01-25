import React from 'react';
import { connect } from "react-redux";
import { Button, List } from 'semantic-ui-react';
import { getNextLevel } from "../actions"

interface Props {
  onGetNextLevel: (uid: string, currentLvl: number) => Promise<any>
  auth: any;
  game: any;
}

class LevelList extends React.Component<Props> {
  changeLvl = (i: number) => {
    const { uid } = this.props.auth.logged_user
    this.props.onGetNextLevel(uid, i - 1)
  }
  render() {
    const { lvls } = this.props.game;
    const { current_game } = this.props.game;
    const levels = []
    for (let i = 0; i < lvls; i++) {
      levels.push(
        <List.Item key={i}>
          <Button onClick={this.changeLvl.bind(this, i)} color={current_game.lvl === i  ? 'teal' : 'grey'} style={{width:'100%'}} content={i}/>
        </List.Item>
      )
    }
    return (
      <List selection={true} horizontal={true} verticalAlign='middle'>
        {levels}
      </List>
    )
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
)(LevelList);
