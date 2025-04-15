// mikebot.js - A Slack bot that responds to mentions using Claude API
// Import the Bolt package for Slack app development
const { App } = require('@slack/bolt');
require('dotenv').config(); // Load environment variables from .env file

// Import Anthropic SDK
const Anthropic = require('@anthropic-ai/sdk');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Initialize your Slack app with your bot token and app token
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true, // Enable Socket Mode
  appToken: process.env.SLACK_APP_TOKEN // Required for Socket Mode
});

// Function to send message to Claude and get response
async function askClaude(message) {
  try {
    console.log('Sending message to Claude:', message);

    const response = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || "claude-3-5-sonnet-20240307",
      max_tokens: 1000,
      messages: [
        { role: "user", content: message }
      ],
      temperature: 0.7,
    });

    console.log('Claude response:', response.content[0].text);
    return response.content[0].text;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return `Sorry, I encountered an error when communicating with Claude: ${error.message}`;
  }
}

// Listen for the app_mention event, which is triggered when someone mentions @mikebot
app.event('app_mention', async ({ event, say }) => {
  try {
    console.log('Received app_mention event:', JSON.stringify(event, null, 2));

    // Extract the text without the bot mention
    const text = event.text.replace(/<@[A-Z0-9]+>/g, '').trim();
    console.log('Extracted text:', text);

    // Send a temporary "thinking" message
    const thinkingMessage = await say({
      text: `:thinking_face: Hmm, let me think about that...`,
      thread_ts: event.ts // Reply in thread if the message was in a thread
    });

    // If there's no content in the message, ask for more information
    if (!text) {
      await app.client.chat.update({
        channel: event.channel,
        ts: thinkingMessage.ts,
        text: "Hi there! I noticed you mentioned me but didn't include a message. How can I help you today?"
      });
      return;
    }

    // Add user context information to the message sent to Claude
    const userInfo = await app.client.users.info({ user: event.user });
    const username = userInfo.user.real_name || userInfo.user.name;

    const enhancedMessage = `
    The following is a message from ${username} in a Slack workspace:
    ---
    ${text}
    ---
    Please respond in a helpful, concise, and friendly manner. 
    Your response will be sent directly to the Slack channel or thread.
    `;

    // Get response from Claude
    const claudeResponse = await askClaude(enhancedMessage);

    // Update the thinking message with Claude's response
    await app.client.chat.update({
      channel: event.channel,
      ts: thinkingMessage.ts,
      text: claudeResponse
    });

  } catch (error) {
    console.error(`Error handling app_mention event: ${error}`);

    // Try to send an error message if possible
    try {
      await say(`Sorry, I encountered an error: ${error.message}`);
    } catch (secondaryError) {
      console.error('Could not send error message:', secondaryError);
    }
  }
});

// Start the app
(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ mikebot with Claude integration is running!');

    // Verify Slack token validity
    try {
      const authTest = await app.client.auth.test();
      console.log(`✅ Bot connected as ${authTest.bot_id} (${authTest.user_id}) to workspace ${authTest.team_id}`);
    } catch (error) {
      console.error('❌ Authentication failed. Please check your Slack bot token.');
      console.error(error);
      process.exit(1);
    }

    // Verify Anthropic API key
    try {
      const testResponse = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || "claude-3-5-sonnet-20240307",
        max_tokens: 10,
        messages: [{ role: "user", content: "Hello, Claude! This is a test message." }]
      });
      console.log('✅ Claude API connection successful');
    } catch (error) {
      console.error('❌ Claude API authentication failed. Please check your Anthropic API key.');
      console.error(error);
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Failed to start the app:', error);
    process.exit(1);
  }
})();