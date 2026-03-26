# RDJmage

A Telegram bot for image processing.

## Setup

1. Create a Telegram bot via [@BotFather](https://t.me/BotFather) and get your bot token.

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set your bot token:
   ```bash
   cp .env.example .env
   # Edit .env and add your TELEGRAM_BOT_TOKEN
   ```

4. Run the bot:
   ```bash
   python bot.py
   ```

## Commands

- `/start` - Welcome message
- `/help` - List available filters
- `/grayscale` - Convert image to grayscale
- `/blur` - Apply blur effect
- `/sharpen` - Sharpen the image
- `/contour` - Apply contour filter
- `/mirror` - Mirror the image horizontally

Send a photo to the bot, then use any command to apply a filter.
