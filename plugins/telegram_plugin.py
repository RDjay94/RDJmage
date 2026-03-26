"""Telegram bot plugin for RDJmage - image processing via Telegram."""

import io
import logging

from PIL import Image, ImageFilter
from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    ContextTypes,
    MessageHandler,
    filters,
)

from config import TELEGRAM_BOT_TOKEN

logger = logging.getLogger(__name__)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(
        "Welcome to RDJmage bot!\n\n"
        "Send me an image and I'll process it for you.\n\n"
        "Commands:\n"
        "/start - Show this message\n"
        "/help - Show available image filters\n"
    )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(
        "Send me an image, then use these commands:\n"
        "/grayscale - Convert to grayscale\n"
        "/blur - Apply blur effect\n"
        "/sharpen - Sharpen the image\n"
        "/contour - Apply contour filter\n"
        "/mirror - Mirror the image horizontally\n"
    )


async def handle_image(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    photo = update.message.photo[-1]
    file = await context.bot.get_file(photo.file_id)
    image_bytes = await file.download_as_bytearray()
    context.user_data["last_image"] = bytes(image_bytes)
    await update.message.reply_text(
        "Image received! Use a command to process it:\n"
        "/grayscale /blur /sharpen /contour /mirror"
    )


async def _apply_filter(update: Update, context: ContextTypes.DEFAULT_TYPE, process_fn):
    image_data = context.user_data.get("last_image")
    if not image_data:
        await update.message.reply_text("Send me an image first!")
        return

    img = Image.open(io.BytesIO(image_data))
    result = process_fn(img)

    output = io.BytesIO()
    result.save(output, format="PNG")
    output.seek(0)
    await update.message.reply_photo(photo=output)


async def grayscale(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await _apply_filter(update, context, lambda img: img.convert("L"))


async def blur(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await _apply_filter(update, context, lambda img: img.filter(ImageFilter.GaussianBlur(radius=5)))


async def sharpen(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await _apply_filter(update, context, lambda img: img.filter(ImageFilter.SHARPEN))


async def contour(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await _apply_filter(update, context, lambda img: img.filter(ImageFilter.CONTOUR))


async def mirror(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await _apply_filter(update, context, lambda img: img.transpose(Image.FLIP_LEFT_RIGHT))


def register(application: Application) -> None:
    """Register all telegram plugin handlers with the application."""
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("grayscale", grayscale))
    application.add_handler(CommandHandler("blur", blur))
    application.add_handler(CommandHandler("sharpen", sharpen))
    application.add_handler(CommandHandler("contour", contour))
    application.add_handler(CommandHandler("mirror", mirror))
    application.add_handler(MessageHandler(filters.PHOTO, handle_image))


def create_app() -> Application:
    """Create and configure the Telegram bot application."""
    if not TELEGRAM_BOT_TOKEN:
        raise ValueError("TELEGRAM_BOT_TOKEN environment variable is not set")

    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    register(application)
    return application
