<h1>
  <img src="https://beta.getmotivatedbuddies.com/static/media/logo@2x.f0ffd680.png" alt="Get Motivated Buddies" width="300">
</h1>

## Setup

```sh
yarn
```

## Main Scripts

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn release`

Builds the app and uploads the source maps to Sentry. Get the token from: https://sentry.io/settings/account/api/auth-tokens/.

Usage for test: `SENTRY_AUTH_TOKEN=YOUR_SENTRY_TOKEN SENTRY_PROJECT=test-getmotivatedbuddies yarn release`
Usage for beta: `SENTRY_AUTH_TOKEN=YOUR_SENTRY_TOKEN SENTRY_PROJECT=beta-getmotivatedbuddies yarn release`

## Contributing

* Read [CSS Guidelines](/docs/CSS_GUIDELINES.md)
* Read [Components Guidelines](/docs/COMPONENTS_GUIDELINES.md)

### To refactor:
- Some pages have two stylesheets, e.g Plan.scss and styles/partials/_plan.scss, which should be merged progressively.
- Some components like pages are doing too much, which ends in long js and scss files, they need to be split.


This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app), check out [CRA Docs](https://facebook.github.io/create-react-app/docs/getting-started) for more information.


## Deploy

- Test: `REACT_APP_GMB_ENV=test SENTRY_AUTH_TOKEN=YOUR_SENTRY_TOKEN SENTRY_PROJECT=test-getmotivatedbuddies yarn release && aws s3 sync build/ s3://www.test.getmotivatedbuddies.com`
- Beta: `REACT_APP_GMB_ENV=beta SENTRY_AUTH_TOKEN=YOUR_SENTRY_TOKEN SENTRY_PROJECT=beta-getmotivatedbuddies yarn release && aws s3 sync build/ s3://www.beta.getmotivatedbuddies.com`
- Test from windows: `SET REACT_APP_GMB_ENV=test && SET SENTRY_AUTH_TOKEN=YOUR_SENTRY_TOKEN && SET SENTRY_PROJECT=test-getmotivatedbuddies && yarn release-windows && aws s3 sync build/ s3://www.test.getmotivatedbuddies.com`
- Beta from windows: `SET REACT_APP_GMB_ENV=beta && SET SENTRY_AUTH_TOKEN=YOUR_SENTRY_TOKEN && SET SENTRY_PROJECT=beta-getmotivatedbuddies && yarn release-windows && aws s3 sync build/ s3://www.beta.getmotivatedbuddies.com`
