import React, { FunctionComponent } from "react";
import { Container, Header, Button, Segment, Grid, List, Divider } from 'semantic-ui-react';

interface Props {
  logout: () => void;
}

export const AppFooter: FunctionComponent<Props> = ({
  logout
}) => {
  return (
    <Segment className="mad-vocab-footer" inverted={true} vertical={true} style={{ marginTop: '2em', padding: '3em 0em' }}>
      <Container centered='true' textAlign='center'>
        <Grid divided={true} inverted={true} stackable={true}>
          <Grid.Column style={{ display: 'grid', justifyContent: 'center', alignItems: 'center' }} width={10} textAlign="left">
            <Header centered='true' inverted={true} as='h4' content='Game Rules' />
            <li>
              You start with 10pts and earn 1pt for each word you find
            </li>
            <li>
              You loose 1pt per failed word translation
            </li>
            <li>
              You need to find 10 words in a row to complete the level
            </li>
          </Grid.Column>
          <Grid.Column style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} width={4}>
            <Button onClick={logout} negative={true}>Log out</Button>
          </Grid.Column>
        </Grid>
        <Divider inverted={true} section={true} />
        <List horizontal={true} inverted={true} divided={true} link={true} size='small'>
          <List.Item as='a' href='#'>
            Contact Us
          </List.Item>
          <List.Item as='a' href='#'>
            Terms and Conditions
          </List.Item>
          <List.Item as='a' href='#'>
            Privacy Policy
          </List.Item>
        </List>
      </Container>
    </Segment>
  );
};