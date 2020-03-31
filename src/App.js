import React, { useState, useEffect, useRef } from 'react';
import { withStyles } from '@material-ui/styles';
import { Slider, Typography } from 'antd';
import Boid from './Boid';

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
  canvas: {
    width: '600px',
    height: '600px',
    backgroundColor: '#000000'
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

const minNumBirds = 2;
const maxNumBirds = 30;
const minBirdSpeed = 3;
const maxBirdSpeed = 8;
const minAvoidCrowd = 1;
const maxAvoidCrowd = 10;

function App({ classes }) {
  const canvas = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [boids, setBoids] = useState([
    { id: 1, x: 100, y: 100, vx: 0, vy: 0 },
    { id: 2, x: 200, y: 200, vx: 0, vy: 0 },
    { id: 3, x: 200, y: 100, vx: 0, vy: 0 },
    { id: 3, x: 550, y: 550, vx: 0, vy: 0 }
  ]);
  const [numBirds, setNumBirds] = useState(minNumBirds);
  const [birdSpeed, setBirdSpeed] = useState(
    Math.trunc((minBirdSpeed + maxBirdSpeed) / 2)
  );
  const [avoidCrowd, setAvoidCrowd] = useState(
    Math.trunc((minAvoidCrowd + maxAvoidCrowd) / 2)
  );

  useEffect(() => {
    if (canvas.current) {
      const { x, y } = canvas.current.getBoundingClientRect();
      setOffset({ x, y });
    }
  }, [canvas]);

  useEffect(() => {
    let _boids = boids;

    const applyRule1 = () => {
      _boids = _boids.map(self => {
        const otherBoids = _boids.filter(boid => self.id !== boid.id);
        const avgX = otherBoids.map(b => b.x).reduce((acc, cur) => {
          return acc + cur;
        }) / otherBoids.length;
        const avgY = otherBoids.map(b => b.y).reduce((acc, cur) => {
          return acc + cur;
        }) / otherBoids.length;
        let newVx = (avgX - self.x);
        let newVy = (avgY - self.y);
        const magnitude = Math.sqrt(newVx * newVx + newVy * newVy);
        newVx /= magnitude;
        newVy /= magnitude;
        newVx *= birdSpeed;
        newVy *= birdSpeed;

        return {
          ...self,
          vx: newVx,
          vy: newVy
        };
      });
    };

    // const applyRule2 = () => {
    // };

    // const applyRule3 = () => {
    // };

    const moveBoids = () => {
      setBoids(_boids.map(boid => ({
        ...boid,
        x: boid.x + boid.vx,
        y: boid.y + boid.vy,
      })));
    };

    setTimeout(() => {
      applyRule1(); // boids move towards center perceived of mass
      // applyRule2();
      // applyRule3();
      moveBoids();
    }, 1000 / 2);
  }, [boids]);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography.Title>Simulating Flocking Behavior</Typography.Title>
      </div>
      <div className={classes.content}>
        <div className={classes.canvas} ref={canvas}>
          {boids.map((boid, index) => {
            return (
              <Boid key={index} boid={boid} offset={offset} />
            );
          })}
        </div>
        <div className={classes.inputContainer}>
          <Typography.Text>
            Number of birds
          </Typography.Text>
          <Slider
            value={numBirds}
            min={minNumBirds}
            max={maxNumBirds}
            onChange={value => setNumBirds(value)}
          />
          <Typography.Text>
            Speed towards flock
          </Typography.Text>
          <Slider
            value={birdSpeed}
            min={minBirdSpeed}
            max={maxBirdSpeed}
            onChange={(value) => setBirdSpeed(value)}
          />
          <Typography.Text>
            Tendency to avoid crowding
          </Typography.Text>
          <Slider
            value={avoidCrowd}
            min={minAvoidCrowd}
            max={maxAvoidCrowd}
            onChange={(value) => setAvoidCrowd(value)}
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
