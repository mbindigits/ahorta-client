import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import DeviceHubIcon from '@material-ui/icons/Devices';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

export default function ProfileMenu(props) {
  const classes = useStyles();

  const logout = async () => {
    await props.onLogout()
    props.logged && await props.logged()
    props.history.push({ pathname: '/' })
  }

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItem>
            <ListItemAvatar>
            <Avatar>
                <AccountBoxIcon />
            </Avatar>
            </ListItemAvatar>
            <ListItemText primary={props.user && props.user.name} secondary={props.user && props.user.email} />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemIcon>
            <DeviceHubIcon />
          </ListItemIcon>
          <ListItemText primary="Devices" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <AccountBoxIcon />
          </ListItemIcon>
          <ListItemText primary="Account" />
        </ListItem>
        <Divider />
        <List component="nav" aria-label="secondary mailbox folders">
            <ListItemLink onClick={() => logout()}>
            <ListItemText primary="Logout" />
            </ListItemLink>
        </List>
      </List>
    </div>
  );
}