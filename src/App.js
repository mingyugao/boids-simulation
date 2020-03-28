import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/styles';
import { Slider, Typography } from 'antd';

const styles = () => ({
  root: {
    height: '100%',
    backgroundColor: '#434343',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  header: {
    textAlign: 'center',
    '& > h1': {
      color: '#ffffff',
      margin: '0.5em 0 -0.5em'
    }
  },
  content: {
    width: '900px',
    display: 'flex',
    margin: 'auto'
  },
  footer: {
    textAlign: 'center',
    backgroundColor: '#8c8c8c'
  },
  canvasContainer: {
    width: '600px',
    height: '600px',
    '& > canvas': {
      width: '100%',
      height: '100%',
      backgroundColor: '#000000'
    }
  },
  inputContainer: {
    width: '300px',
    height: '600px',
    padding: '1rem',
    backgroundColor: '#595959',
    '& > span': {
      color: '#ffffff'
    },
    '& > div.ant-slider': {
      marginBottom: '2rem',
      '& > div.ant-slider-rail': {
        backgroundColor: '#8c8c8c'
      }
    }
  }
});

const addBoid = () => {
};

const removeBoid = () => {
};

const moveBoids = boids => {
  return boids;
};

const drawBoids = (ctx, boids) => {
  // boids.forEach(boid => {
  //   ctx.fillRect(boid.x, boid.y, 50, 50);
  // });
};

const minNumBirds = 1;
const maxNumBirds = 30;
const minBirdSpeed = 1;
const maxBirdSpeed = 10;
const minAvoidCrowd = 1;
const maxAvoidCrowd = 10;

function App({ classes }) {
  const [numBirds, setNumBirds] = useState(minNumBirds);
  const [birdSpeed, setBirdSpeed] = useState(
    Math.trunc((minBirdSpeed + maxBirdSpeed) / 2)
  );
  const [avoidCrowd, setAvoidCrowd] = useState(
    Math.trunc((minAvoidCrowd + maxAvoidCrowd) / 2)
  );

  const [boids, setBoids] = useState([]);

  // useEffect(() => {
  //   if (numBirds > boids.length) {
  //     setBoids(addBoid(boids));
  //   } else {
  //     setBoids(removeBoid(boids));
  //   }
  // }, [numBirds]);

  // useEffect(() => {
  //   const canvas = document.getElementById('canvas');
  //   const ctx = canvas.getContext('2d');
  //
  //   setInterval(() => {
  //     drawBoids(ctx, boids);
  //     setBoids(moveBoids(boids));
  //   }, 1000);
  // }, []);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography.Title>Simulating Flocking Behavior</Typography.Title>
      </div>
      <div className={classes.content}>
        <div className={classes.canvasContainer}>
          <canvas id="canvas" />
        </div>
        <div className={classes.inputContainer}>
          <Typography.Text>
            Number of birds
          </Typography.Text>
          <Slider
            value={numBirds}
            min={minNumBirds}
            max={maxNumBirds}
            onChange={setNumBirds}
          />
          <Typography.Text>
            Speed towards flock
          </Typography.Text>
          <Slider
            value={birdSpeed}
            min={minBirdSpeed}
            max={maxBirdSpeed}
            onChange={setBirdSpeed}
          />
          <Typography.Text>
            Tendency to avoid crowding
          </Typography.Text>
          <Slider
            value={avoidCrowd}
            min={minAvoidCrowd}
            max={maxAvoidCrowd}
            onChange={setAvoidCrowd}
          />
        </div>
      </div>
      <div className={classes.footer}>
        <Typography.Text>
          COGS 300 Group 12 - Hary Chow, Raymond Chuong, Jenna Fletcher, Mingyu Gao
        </Typography.Text>
      </div>
    </div>
  );
}

export default withStyles(styles)(App);
