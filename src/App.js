import React, { useState, useEffect, useRef } from 'react';
import { withStyles } from '@material-ui/styles';
import { Button, Slider, Typography } from 'antd';
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
  },
  numBirdsControl: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0.5rem 0 1.5rem',
    '& > button': {
      width: '6rem'
    },
    '& > span': {
      color: '#ffffff'
    }
  }
});

const minNumBirds = 2;
const maxNumBirds = 30;
const minBirdSpeed = 3;
const maxBirdSpeed = 8;
const minAvoidCrowd = 1;
const maxAvoidCrowd = 5;

const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

function App({ classes }) {
  const canvas = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [boids, setBoids] = useState([
    { id: Date.now() - 1, x: getRandomInt(600), y: getRandomInt(600), vx: 0, vy: 0 },
    { id: Date.now(), x: getRandomInt(600), y: getRandomInt(600), vx: 0, vy: 0 }
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
        let newVx = avgX - self.x;
        let newVy = avgY - self.y;
        const magnitude = Math.sqrt(Math.pow(newVx, 2) + Math.pow(newVy, 2));

        return {
          ...self,
          vx: newVx / magnitude,
          vy: newVy / magnitude
        };
      });
    };

    const applyRule2 = () => {
      _boids = _boids.map(self => {
        const otherBoids = _boids.filter(boid => self.id !== boid.id);
        let accVx = 0;
        let accVy = 0;
        otherBoids.forEach(other => {
          const distance = Math.sqrt(
            Math.pow(self.x - other.x, 2) + Math.pow(self.y - other.y, 2)
          );
          if (distance < avoidCrowd * 20) {
            let newVx = self.x - other.x;
            let newVy = self.y - other.y;
            const magnitude = Math.sqrt(Math.pow(newVx, 2) + Math.pow(newVy, 2));
            newVx = newVx / magnitude;
            newVy = newVy / magnitude;
            accVx += newVx;
            accVy += newVy;
            const accMagnitude = Math.sqrt(Math.pow(accVx, 2) + Math.pow(accVy, 2));
            accVx /= accMagnitude;
            accVy /= accMagnitude;
          }
        });

        return {
          ...self,
          vx: accVx ? accVx : self.vx,
          vy: accVy ? accVy : self.vy
        };
      });
    };

    // const applyRule3 = () => {
    // };

    const moveBoids = () => {
      _boids = _boids.map(boid => {
        let newX = boid.x + birdSpeed * boid.vx;
        let newY = boid.y + birdSpeed * boid.vy;
        if (newX < 0) newX = 0;
        if (newX > 600) newX = 600;
        if (newY < 0) newY = 0;
        if (newY > 600) newY = 600;
        return {
          ...boid,
          x: newX,
          y: newY
        };
      });
    };

    const addRemoveBoids = () => {
      const difference = numBirds - _boids.length;
      if (difference > 0) {
        for (let i = 0; i < difference; i++) {
          _boids = [..._boids, {
            id: Date.now(),
            x: getRandomInt(600),
            y: getRandomInt(600),
            vx: 0,
            vy: 0
          }];
        }
      } else if (difference < 0) {
        for (let i = 0; i < Math.abs(difference); i++) {
          _boids = _boids.slice(0, boids.length - 1);
        }
      }
    };

    setTimeout(() => {
      applyRule1(); // boids move towards center perceived of mass
      applyRule2(); // boids try to keep a small distance away from other boids
      // applyRule3();
      moveBoids();
      addRemoveBoids();
      setBoids(_boids);
    }, 1000 / 5);
  }, [boids]);


  const handleClick = newNumBirds => {
    if (
      newNumBirds !== numBirds &&
      newNumBirds >= minNumBirds &&
      newNumBirds <= maxNumBirds
    ) {
      setNumBirds(newNumBirds);
    }
  };

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
          <div className={classes.numBirdsControl}>
            <Button
              disabled={numBirds === minNumBirds}
              shape="round"
              onClick={() => handleClick(numBirds - 1)}
            >
              Remove
            </Button>
            <Typography.Text>
              {numBirds}
            </Typography.Text>
            <Button
              disabled={numBirds === maxNumBirds}
              shape="round"
              onClick={() => handleClick(numBirds + 1)}
            >
              Add
            </Button>
          </div>
          <Typography.Text>
            Speed
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
            step={0.5}
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
