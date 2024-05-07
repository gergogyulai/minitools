import os
import time
import schedule
import logging
from dotenv import load_dotenv
from supabase import create_client, Client
from instagrapi import Client as InstaClient

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s: %(message)s')

load_dotenv()
if not os.path.exists('.env'):
    with open('.env', 'w') as f:
        f.write("INSTAGRAM_USERNAME=" + input("Enter your Instagram username: ") + "\n")
        f.write("INSTAGRAM_PASSWORD=" + input("Enter your Instagram password: ") + "\n")
        f.write("INSTAGRAM_2FA_SEED=" + input("Enter your Instagram 2FA seed (leave blank if not using 2FA): ") + "\n")
        f.write("SUPABASE_URL=" + input("Enter your Supabase URL (leave blank if not using Supabase for Storage): ") + "\n")
        f.write("SUPABASE_KEY=" + input("Enter your Supabase key (leave blank if not using Supabase for Storage): ") + "\n")
        print("Created .env file.")
    exit()
else:
    print(".env file found.")
    required_variables = ["INSTAGRAM_USERNAME", "INSTAGRAM_PASSWORD", "INSTAGRAM_2FA_SEED", "SUPABASE_URL", "SUPABASE_KEY"]
    missing_variables = [var for var in required_variables if os.getenv(var) is None]
    if missing_variables:
        print("Missing required environment variables in .env file:")
        for var in missing_variables:
            value = input(f"Enter value for {var}: ")
            with open('.env', 'a') as f:
                f.write(f"{var}={value}\n")
            print(f"Added {var}={value} to .env file.")
    else:
        print("All required environment variables are present in the .env file.")
load_dotenv()

def initialize_instagram_client(INSTAGRAM_USERNAME, INSTAGRAM_PASSWORD, INSTAGRAM_2FA_SEED):
    try:
        instagram = InstaClient()
        if INSTAGRAM_2FA_SEED:
            instagram.login(INSTAGRAM_USERNAME, INSTAGRAM_PASSWORD, verification_code=instagram.totp_generate_code(INSTAGRAM_2FA_SEED))
        else:
            instagram.login(INSTAGRAM_USERNAME, INSTAGRAM_PASSWORD)
        logging.info(f"Successfully logged in as @{instagram.username_from_user_id(instagram.user_id)} User ID: {instagram.user_id}")
        return instagram
    except Exception as e:
        logging.error(f"Error during Instagram login: {str(e)}")
        raise

def get_notes(instagram, supabase):
    try:
        logging.info("Fetching notes...")
        notes = instagram.get_notes()
        for note in notes:
            existing = supabase.table("notes").select("*").eq("note", note.text).eq("userid", note.user_id).execute()
            if existing.data:
                logging.info(f"Note already exists in database: {note.text} by {note.user.username}")
            else:
                _, _ = supabase.table("notes").insert([{
                    "username": note.user.username,
                    "userid": note.user_id,
                    "note": note.text,
                    "date": note.created_at.isoformat(),
                    "profile_pic_url": str(note.user.profile_pic_url)
                }]).execute()
                logging.info(f"Saved NEW Note to database: {note.text} by {note.user.username}")
    except Exception as e:
        logging.error(f"Error while fetching notes: {str(e)}")

def main():
    try:
        SUPABASE_URL = os.getenv("SUPABASE_URL")
        SUPABASE_KEY = os.getenv("SUPABASE_KEY")
        INSTAGRAM_USERNAME = os.getenv("INSTAGRAM_USERNAME")
        INSTAGRAM_PASSWORD = os.getenv("INSTAGRAM_PASSWORD")
        INSTAGRAM_2FA_SEED = os.getenv("INSTAGRAM_2FA_SEED")
        
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        instagram = initialize_instagram_client(INSTAGRAM_USERNAME, INSTAGRAM_PASSWORD, INSTAGRAM_2FA_SEED)

        get_notes(instagram, supabase)
        schedule.every(10).minutes.do(get_notes, instagram, supabase)
        
        while True:
            schedule.run_pending()
            time.sleep(5)
    except Exception as e:
        logging.error(f"An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    main()