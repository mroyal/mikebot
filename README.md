# MikeBot - Claude-Powered Slack Assistant

A Slack bot that integrates with Anthropic's Claude AI to provide helpful responses directly in your Slack workspace. Simply mention `@mikebot` in any channel or thread and get AI-powered assistance.

## Features

- Responds to mentions in Slack channels and threads
- Uses Claude AI for generating helpful, concise responses
- Provides friendly acknowledgment while processing requests
- Includes user context when communicating with Claude for personalized responses
- Runs in Socket Mode to avoid complicated networking setup

## Prerequisites

- Node.js (v14 or later recommended)
- An Anthropic API key (for Claude)
- A Slack workspace where you can create apps
- Slack app with appropriate permissions and tokens

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/mikebot.git
   cd mikebot
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the project root with the following variables:
   ```
   SLACK_BOT_TOKEN=xoxb-your-bot-token
   SLACK_SIGNING_SECRET=your-signing-secret
   SLACK_APP_TOKEN=xapp-your-app-token
   ANTHROPIC_API_KEY=your-anthropic-api-key
   CLAUDE_MODEL=claude-3-5-sonnet-20240307  # Optional, defaults to claude-3-5-sonnet-20240307
   PORT=3000  # Optional, defaults to 3000
   ```

## Slack App Configuration

1. Create a new Slack app at [api.slack.com/apps](https://api.slack.com/apps)
2. Under "OAuth & Permissions," add the following bot token scopes:
   - `app_mentions:read` - To read when the bot is mentioned
   - `chat:write` - To send messages
   - `users:read` - To get information about users

3. Enable Socket Mode in your Slack app settings
4. Generate an app-level token with the `connections:write` scope
5. Install the app to your workspace

## Running the Bot

Start the bot with:

```
node mikebot.js
```

You should see confirmation messages in the console:
- "⚡️ mikebot with Claude integration is running!"
- "✅ Bot connected as [bot_id]..."
- "✅ Claude API connection successful"

## Usage

1. In any Slack channel where the bot is present, mention the bot with a message:
   ```
   @mikebot What's the weather like today?
   ```

2. The bot will:
   - Send a "thinking" message
   - Process your request through Claude
   - Update the message with Claude's response

3. If you mention the bot without a message, it will prompt you for input.

## Error Handling

The bot includes error handling for:
- Invalid Slack tokens
- Invalid Anthropic API key
- Errors when communicating with Claude
- General runtime errors

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SLACK_BOT_TOKEN` | The OAuth token for your Slack bot |
| `SLACK_SIGNING_SECRET` | Signing secret from your Slack app configuration |
| `SLACK_APP_TOKEN` | App-level token for Socket Mode (starts with `xapp-`) |
| `ANTHROPIC_API_KEY` | Your Anthropic API key for Claude access |
| `CLAUDE_MODEL` | (Optional) Claude model to use, defaults to `claude-3-5-sonnet-20240307` |
| `PORT` | (Optional) Port for the app to listen on, defaults to 3000 |

## Customization

- Adjust the `max_tokens` and `temperature` parameters in the `askClaude` function to control response length and creativity
- Modify the prompt sent to Claude in the `enhancedMessage` variable to change how responses are formatted or to add specific instructions

## License

MIT License

## Acknowledgments

- This project uses the [Bolt for JavaScript](https://slack.dev/bolt-js/) framework for Slack app development
- AI responses powered by [Anthropic's Claude](https://www.anthropic.com/claude)
