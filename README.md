# `web-quiz`: a modern, mobile-first web quiz for STEM courses

[![Build Status](https://travis-ci.org/tum-rt/web-quiz.svg?branch=master)](https://travis-ci.org/tum-rt/web-quiz)
[![dependencies Status](https://david-dm.org/tum-rt/web-quiz/status.svg)](https://david-dm.org/tum-rt/web-quiz)
[![devDependencies Status](https://david-dm.org/tum-rt/web-quiz/dev-status.svg)](https://david-dm.org/tum-rt/web-quiz?type=dev)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e472f63f397543a584f70b427b5ef51d)](https://www.codacy.com/app/tum-rt/web-quiz?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=tum-rt/web-quiz&amp;utm_campaign=Badge_Grade)
[![Code Climate](https://codeclimate.com/github/tum-rt/web-quiz/badges/gpa.svg)](https://codeclimate.com/github/tum-rt/web-quiz)
[![Coverage Status](https://coveralls.io/repos/github/tum-rt/web-quiz/badge.svg?branch=master)](https://coveralls.io/github/tum-rt/web-quiz?branch=master)

## Features
* Basic multiple choice questions (single answer and multiple answer)
* Support for numerical problems with a tolerance region for the correct answers
* Plot and LaTeX rendering
* Mobile-first, responsive web design
* Lightweight question specification in YAML

## Installation

Requirements: Node.js >= 6.x

We use [Yarn](https://yarnpkg.com/) for package management.
Please install it as described [here](https://yarnpkg.com/en/docs/install).

```sh
git clone https://github.com/tum-rt/web-quiz.git
cd web-quiz
yarn
npm run build
npm run dev
```

## Convenience scripts
* `npm run dev`: run server with example-quiz in development mode
* `npm run build`: build the app
* `npm run buildp`: production build, `bundle.js` is minified
* `npm run watch`: watch sources and rebuild the client app on changes
* `npm run doc`: generate API documentation, see `./apidoc/index.html`
* `npm run test`: runs backend unit tests
* `npm run coverage`: runs backend unit tests with coverage

## Docker Quickstart

```sh
git clone https://github.com/tum-rt/web-quiz.git
cd web-quiz
docker build -t web-quiz .
docker run --rm -it -p 3000:3000 web-quiz
```
