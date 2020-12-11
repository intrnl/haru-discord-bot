import { define } from '../lib/handler';


define('ping', ({ member }) => {
	return `Hello, ${member.nick ?? member.user.username}! It is ${new Date().toISOString()} currently.`;
});
