import React,  { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Slider from '@material-ui/lab/Slider';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import SimpleLineChart from './SimpleLineChart';
import Loading from './common/Loading';
import SwipeDialog from './dialogs/SwipeDialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SectionHeader from './typo/SectionHeader';

import ImageCard from './cards/ImageCard'
import Topbar from './Topbar';
import SensorChart from './SensorChart'

import { Percent as percent } from '../modules/Percent'
import { host } from '../url'

const numeral = require('numeral');
numeral.defaultFormat('0');

const backgroundShape = require('../images/shape.svg');

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey['100'],
    overflow: 'hidden',
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: 'cover',
    backgroundPosition: '0 400px',
    paddingBottom: 200
  },
  grid: {
    width: 1200,
    margin: `0 ${theme.spacing.unit * 2}px`,
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% - 20px)'
    }
  },
  loadingState: {
    opacity: 0.05
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  rangeLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.unit * 2
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  outlinedButtom: {
    textTransform: 'uppercase',
    marginTop: theme.spacing.unit
  },
  actionButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing.unit,
    width: 152,
    height: 36
  },
  blockCenter: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center'
  },
  block: {
    padding: theme.spacing.unit * 2,
  },
  loanAvatar: {
    display: 'inline-block',
    verticalAlign: 'center',
    width: 16,
    height: 16,
    marginRight: 10,
    marginBottom: -2,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main
  },
  interestAvatar: {
    display: 'inline-block',
    verticalAlign: 'center',
    width: 16,
    height: 16,
    marginRight: 10,
    marginBottom: -2,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light
  },
  inlining: {
    display: 'inline-block',
    marginRight: 10
  },
  buttonBar: {
    display: 'flex'
  },
  noBorder: {
    borderBottomStyle: 'hidden'
  },
  mainBadge: {
    textAlign: 'center',
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4
  }
});

class Dashboard extends Component {

  state = {
    device: {},
    loading: false,
    howItWorksDialog: false,
    amount: 1,
    period: 24,
    start: 10,
    data: []
  };

  updateValues() {
    
  }

  

  async componentDidMount() {
    await this.props.logged()
    const dashboardId = this.props.match.params.id
    const response = await axios.get(host + `/devices/${dashboardId}`,
      {
        headers: {
          'Authorization': `Basic ${process.env.REACT_APP_SECRET}`,
          'Content-Type': 'application/json'
        }
      }
    )
    this.setState({device: response.data})
    this.setState({start: response.data && response.data.threshold, amount: response.data && response.data.timer / 3600000})
    this.updateValues();
  }

  openDialog = (event) => {
    this.setState({howItWorksDialog: true});
  }

  dialogClose = (event) => {
    this.setState({howItWorksDialog: false});
  }

  handleChangeAmount = (event, value) => {
    this.setState({amount: value, loading: false});
    const dashboardId = this.props.match.params.id
    axios.put(`${host}/devices/${dashboardId}`,
      {
        timer: value * 3600000
      },
      { 
        headers: {
          'Authorization': `Basic ${process.env.REACT_APP_SECRET}`,
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => {
      console.log('updated', response)
    })
    .catch(error => {
      console.log(error);
    });
    this.updateValues();
  }

  handleChangePeriod = (event, value) => {
    this.setState({period: value, loading: false});
    this.updateValues();
  }

  handleChangeStart = (event, value) => {
    this.setState({start: value, loading: false});
    const dashboardId = this.props.match.params.id
    axios.put(`${host}/devices/${dashboardId}`,
      {
        threshold: value || 0
      },
      { 
        headers: {
          'Authorization': `Basic ${process.env.REACT_APP_SECRET}`,
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => {
      console.log('updated', response)
    })
    .catch(error => {
      console.log(error);
    });
    this.updateValues();
  }

  render() {
    const { classes, loggedUser, history } = this.props;
    const { amount, period, start, loading, device, howItWorksDialog } = this.state;
    const currentPath = this.props.location.pathname

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath} user={loggedUser && loggedUser.data.user} history={history} />
        <div className={classes.root}>
          <Grid container justify="center">
            <Grid spacing={2} alignItems="flex-start" justify="center" container className={classes.grid}>
              <Grid item xs={12}>
                <div className={classes.topBar}>
                  <div className={classes.block}>
                    <small>name:</small>
                    <Typography variant="h4" gutterBottom>
                      { device && device.name } <Chip style={{marginLeft: 10}} variant='outlined' color='primary' label="Public" />
                    </Typography>
                    <Typography variant="body1">
                      Created { device && moment(device.createdAt).fromNow() }
                    </Typography>
                    <Typography variant="body1">
                      Device ID: <strong>{ device && device.deviceId }</strong>
                    </Typography>
                    <Button onClick={this.openDialog} variant="outlined" className={classes.outlinedButtom}>
                      How it works?
                    </Button>
                  </div>
                  <div>
                    <Typography variant="body1">
                      Created by:
                    </Typography>
                    <List>
                      <ListItem onClick={this.toProfile}>
                        <ListItemAvatar>
                        <Avatar>
                            <AccountBoxIcon />
                        </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={device && device.User && device.User.name} secondary={device && device.User && `user since ${moment(device.User.createdAt).fromNow()}`} />
                      </ListItem>
                    </List>
                    
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={8} >
                <Paper className={classes.paper} style={{position: 'relative'}}>
                  <Loading loading={loading} />
                  <div className={loading ? classes.loadingState : ''}>
                    <Typography variant="subtitle1" gutterBottom>
                      Humidity along the time
                    </Typography>
                    <Typography variant="body1">
                      This is the measures we did
                    </Typography>
                    <div style={{marginTop: 14, marginBottom: 14}}>
                      <div className={classes.inlining}>
                        <Avatar className={classes.loanAvatar}></Avatar>
                        <Typography className={classes.inlining} variant="subtitle2" gutterBottom>
                          Value
                        </Typography>
                        <Typography className={classes.inlining} color='secondary' variant="h6" gutterBottom>
                          %
                        </Typography>
                      </div>
                    </div>
                    <div>
                      <SimpleLineChart threshold={device && device.threshold} data={device && device.Readings && device.Readings.map(r => (
                        {
                          value: percent(r.value) || 0,
                          createdAt: moment(r.createdAt).calendar()
                        }
                      ))} />
                    </div>
                  </div>
                </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className={classes.paper} style={{position: 'relative'}}>
                <Loading loading={loading} />
                <Typography variant="subtitle1" gutterBottom>
                  Humidity
                </Typography>
                <Typography variant="body1">
                  This is the humidity from the sensor <br /> {device && device.Readings && device.Readings[0] && moment(device.Readings[0].createdAt).calendar()}
                </Typography>
                <div>
                  <SensorChart threshold={start} value={device && device.Readings && device.Readings[0] && percent(device.Readings && device.Readings[0].value)} data={[
                    { name: device && device.Readings && device.Readings[0] && `${percent(device.Readings[0].value)} %`, value: device && device.Readings && device.Readings[0] && percent(device.Readings && device.Readings[0].value) },
                    { name: 'Group B', value: device && device.Readings && device.Readings[0] && device.Readings && percent(device.Readings[0].value) === 0 ? 100 : device && device.Readings && device.Readings[0] && percent(device.Readings && device.Readings[0].value) * 18}
                  ]} />
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <SectionHeader title="Picutres" subtitle="See how your plant it's looks like" />
            </Grid>
            <Grid item xs={12} md={4}>
              <ImageCard 
                image={require('../images/samples/IMG_0323.jpg')} 
                title='We have flowers on our Basil!'
                description='We were surprising by flowers on our first basil using Ahorta'
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ImageCard 
                image={require('../images/samples/IMG_2473.jpg')} 
                title='Our first food'
                description='After the first leaves used in our delicious food'
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ImageCard 
                image={require('../images/samples/IMG_4260.jpg')} 
                title='Full again'
                description='After some weeks we have the basil ready again'
              />
            </Grid>
            <Grid item xs={12}>
              <SectionHeader title="Controls" subtitle="For the device owner" />
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className={classes.paper}>
                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    How often the device will measure humidity
                  </Typography>
                  <Typography variant="body1">
                    Use sliders to set the reading period <small>(requires restart)</small>
                  </Typography>
                  <div className={classes.blockCenter}>
                    <Typography color='secondary' variant="h6" gutterBottom>
                      from {numeral(amount).format()} to {numeral(amount).format()} hours
                    </Typography>
                  </div>
                  <div>
                    <Slider
                      disabled
                      value={amount}
                      min={1}
                      max={24}
                      step={1}
                      onChange={this.handleChangeAmount}
                    />
                  </div>
                  <div className={classes.rangeLabel}>
                    <div>
                      <Typography variant="subtitle2">
                        1 hour
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle2">
                        24 hours
                      </Typography>
                    </div>
                  </div>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className={classes.paper}>
                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    How often you want to be notified
                  </Typography>
                  <Typography variant="body1">
                    Set the periodicity to receive notifications
                  </Typography>
                  <div className={classes.blockCenter}>
                    <Typography color='secondary' variant="h6" gutterBottom>
                      {period} hours
                    </Typography>
                  </div>
                  <div>
                    <Slider
                      disabled
                      value={period}
                      min={1}
                      max={24}
                      step={1}
                      onChange={this.handleChangePeriod}
                    />
                  </div>
                  <div className={classes.rangeLabel}>
                    <div>
                      <Typography variant="subtitle2">
                        1 hour
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle2">
                        24 hours
                      </Typography>
                    </div>
                  </div>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className={classes.paper}>
                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Threshold
                  </Typography>
                  <Typography variant="body1">
                    What's the target humidity for this plant?
                  </Typography>
                  <div className={classes.blockCenter}>
                    <Typography color='secondary' variant="h6" gutterBottom>
                      {start} %
                    </Typography>
                  </div>
                  <div>
                    <Slider
                      disabled
                      value={start}
                      min={0}
                      max={100}
                      step={1}
                      onChange={this.handleChangeStart}
                    />
                  </div>
                  <div className={classes.rangeLabel}>
                    <div>
                      <Typography variant="subtitle2">
                        0 %
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle2">
                        100 %
                      </Typography>
                    </div>
                  </div>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <SwipeDialog
          open={howItWorksDialog}
          onClose={this.dialogClose} />
      </div>
    </React.Fragment>
    )
  }
}

export default withRouter(withStyles(styles)(Dashboard));
