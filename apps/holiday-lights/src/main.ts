import * as WebSocket from 'ws';
import { send } from './app/functions/send';
import anime from './app/anime';
import * as tinycolor from 'tinycolor2';

const connection = new WebSocket('ws://led-controller.local:7890');

const lights: { color: string; hue: number }[] = Array(64 * 3)
  .fill(null)
  .map(() => ({
    color: 'rgb(255,225,192)', //Math.random() > 0.5 ? 'rgb(255,0,0)' : 'rgb(0,255,0)',
    hue: Math.random() > 0.5 ? 120 : 1,
  }));

connection.on('open', () => {
  console.log('!!! connected!');
  anime({
    targets: lights,
    color: () => (Math.random() > 0.5 ? 'rgb(255,0,0)' : 'rgb(0,255,0)'), //'rgb(255,225,192)',
    hue: 120,
    easing: 'easeInOutBounce',
    direction: 'alternate',
    delay: anime.stagger(10, { from: 'last', direction: 'random' }),
    duration: anime.stagger([2000, 4000], {
      from: 'last',
      direction: 'random',
    }),
    loop: true,
    update: function () {
      const arr = lights.map<[number, number, number]>((c) => {
        // `hsv(${c.hue},1,1)`
        const color = tinycolor(c.color).toRgb();
        return [color.r * color.a, color.g * color.a, color.b * color.a];
      });
      // console.log(arr.slice(-8, -1));
      send(connection, arr);
    },
  });
  // setInterval(
  //   () => console.log(lights.map((c) => c.hue.toFixed(0)).join(',')),
  //   1000
  // );
});
