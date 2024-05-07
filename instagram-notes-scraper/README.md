# Instagram Note Scraper

## 🚀 Introduction
You wan't to keep track of what you "friends" post on their Instagram Notes? This Python script fetches notes from Instagram and stores them in a Supabase database. It utilizes the `instagrapi` library for Instagram interactions and the `supabase-py` library for database operations. The script is designed to run periodically to collect new notes every 10 minutes. It can be easily customized and extended to fit specific use cases, can use virtually any kind of database if you don't like Supabase.

## ⚙️ Setup
Before running the script, ensure you have the necessary dependencies installed. You can install them using pip:

```bash
pip install -r requirements.txt
```

The script requires certain environment variables to be set in a `.env` file:
- `INSTAGRAM_USERNAME`: Your Instagram username.
- `INSTAGRAM_PASSWORD`: Your Instagram password.
- `INSTAGRAM_2FA_SEED`: Your Instagram 2FA seed if used.
- `SUPABASE_URL`: URL of your Supabase project.
- `SUPABASE_KEY`: API key for accessing your [Supabase](https://supabase.com/dashboard) project.

There is a 2fa_setup.py helper included in the folder.

If the `.env` file doesn't exist, the script prompts for these values and creates the file.

If you are going to use Supabase to store the collected notes you will need a table named `notes` with these fields: 
- id: int8
- username: text
- userid: text
- note: text
- date: text
- profile_pic_url: text

## 🚀 Usage
Run the script using Python:

```bash
python3 instagram_notes_collector.py
```

or 

You can create a Docker Container for this program to host it on your NAS or idk

The script runs indefinitely, fetching new notes from Instagram every 10 minutes and storing them in the Supabase database.

## 📦 Dependencies
- `instagrapi`: Python library for Instagram interactions.
- `supabase-py`: Python client for Supabase.
- `schedule`: Python library for task scheduling.
- `python-dotenv`: Python library for reading environment variables.
