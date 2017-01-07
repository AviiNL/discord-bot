# Discord Bot Commands Framework

Basic useful feature list:

 * Written in NodeJS
 * ECMA Script 6
 * Docker
 * Crude Permission system
 * Custom Commands
 
---

### Setup
Clone this project and copy `app/config.sample.json` to `app/config.json` and add your bot's token.

### Run
from the root directory of the project run `docker-compose up` to start the bot, or `docker-compose up -d` to run it as a daemon

### Commands
Commands can be found in `/app/components/discord/commands`

The filename (without .js) indicates the command's name, for example `test.js` will be run when you type `!test` in discord. All commands must extend from `../command.js`

### Permission system
The permission system itself is a *command*. You can add either people or roles in the permission system. You can also give people/roles only access to specific commands, for example `!permission add role admin` will give everyone that has the role with the name `admin` access to ALL commands. `!permission add role moderator test kick ban` will give the role moderator access to the `test`, `kick` and `ban` commands. `!permission add user Test test` will give the `Test` user access to the `test` command.

### Long running listeners
Anything that needs to be a long running instance of something can be added to `app/bootstrap/app.js`'s components array. The `discord` client itself, and the discord command parser are long running listeners. You could for example add an express server or any other servers here.

### Database
For the database there is a mongodb database running in it's own isolated docker container

# License
Copyright 2017 AviiNL

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.