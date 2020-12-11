import { start } from './lib/handler';
import { PUBLIC_KEY } from '../env.json';

import './commands/ping';
import './commands/anilist';


start(PUBLIC_KEY);
