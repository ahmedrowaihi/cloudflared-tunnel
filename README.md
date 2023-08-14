# Cloudlfare-tunnel

A smiple tool automates running a cloudflared-tunnel for exposing your localhost to the world! it could be used as a standalone cli or imported into other libraries CLI's

[![Version](https://img.shields.io/npm/v/cloudflared-tunnel.svg)](https://npmjs.org/package/cloudflared-tunnel) [![cloudlfare-tunnel](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io) [![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main) ![GitHub license](https://img.shields.io/crates/l/MIT)

- [Cloudlfare-tunnel](#cloudlfare-tunnel)
  - [Pre-requisites](#pre-requisites)
  - [Usage CLI](#usage-cli)
    - [Install CLI](#install-cli)
    - [Setup](#setup)
    - [Note: you need to do this only once](#note-you-need-to-do-this-only-once)
    - [Run](#run)
    - [Commands](#commands)
      - [`cf-tunnel`](#cf-tunnel)
      - [Options](#options)
  - [Usage as a library](#usage-as-a-library)
    - [Install Library](#install-library)

<!-- tocstop -->

## Pre-requisites

- **[Cloudflare](https://dash.cloudflare.com/sign-up) account**
- **A Domain that is managed by Cloudflare** you can transfer your domain management to Cloudflare from your current registrar for free

## Usage CLI

### Install CLI

```bash
yarn install -g cloudflared-tunnel
```

### Setup

### Note: you need to do this only once

```bash
cf-tunnel -s
```

OR

```bash
cf-tunnel setup
```

### Run

```bash
cf-tunnel  [-p <port>] [-h <host>] [-s]
```

### Commands

#### `cf-tunnel`

Runs a cloudflared tunnel simply with a single command

```bash
cf-tunnel
```

#### Options

```bash
-p, --port=port # port to expose
-h, --host=host # host to expose
-s, --setup # setup cloudflared tunnel
```

## Usage as a library

### Install Library

```bash
yarn add cloudflared-tunnel
```

```ts
import {setup, startTunnel} from 'cloudflared-tunnel'

await setup() // setup the project | you need to do this only once

await startTunnel({
  host: 'http://localhost', // required
  port: 3000, // required
}) // pass in the host and port of the server you want to tunnel
```
