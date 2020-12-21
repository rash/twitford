# Twitford

Twitford is a tool that can provide you with information to check if an account on [Twitter](https://twitter.com) is a bot or not. This tool uses research from [a paper](https://arxiv.org/pdf/1504.04387.pdf) that determined that Benford's law can be used for bot detection on social media.

## Requirements

In order for Twitford to function correctly, a Twitter developer account is required, and an app must be created. The Bearer token for this app is needed and must be provided through a `config.json` file.
An example of the content required in the file can be found below.

```json
{
    "token": "Your Twitter bearer token"
}
```

## Setup

Step 1: Clone the repository and install the required dependencies

```bash
git clone https://github.com/rash/twitford.git
cd twitford
npm install
```

Step 2: Compile the TypeScript code into JavaScript code

```bash
tsc
```

Step 3: Inside the output directory, create a file named `config.json` with the Bearer token for your app (See [Requirements](#requirements) for instructions on how to do so)

## Usage

In order to launch Twiford, you must run the command `node index.js [username]`, where `[username]` is the username of the Twitter account that should be checked.
If everything works correctly, you should get an output that says `The Pearson correlation of [username] is [value].`, where `[username]` is the username of the account provided, and `[value]` is the [Pearson correlation](https://en.wikipedia.org/wiki/Pearson_correlation_coefficient) of the data gathered by Twitford.
The lower the absolute value of the result is, the higher the chance the account is a bot.

## Licensing

Twitford is licensed under the Zero Clause BSD license. A copy of this license can be found in the LICENSE file.
