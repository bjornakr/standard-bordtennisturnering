# Standard bordtennisturnering

* https://www.dicebear.com/how-to-use/js-library/
* https://colorhunt.co/palette/16c47fffd65aff9d23f93827

# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.


## TODO

- [ ] Figure out how to do *endless mode* (i.e. people just playing until exhaustion)
  * This could be done by allowing generating a new round
  * It must take into consideration home/away matches
- [ ] A player view to display wins/losses vs the other players
- [ ] Design/CSS
  * Headers/footers
  * Get rid of stupid mobile behavior like zooming in all the time 
  * Better indication of change of serve
  * Signalize winners of tournament
- [ ] Route to start page
- [ ] Icon

## v2.0
- [ ] Add/Remove players 