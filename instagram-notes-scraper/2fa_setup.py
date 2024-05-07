import os
from dotenv import load_dotenv
from instagrapi import Client as InstaClient

load_dotenv()

INSTAGRAM_2FA_SEED = os.getenv("INSTAGRAM_2FA_SEED")
 
if INSTAGRAM_2FA_SEED is None:
    print("INSTAGRAM_2FA_SEED is not set in .env file")
    INSTAGRAM_2FA_SEED = input("Please Enter 2FA Seed: ")

instagram = InstaClient()

print(f"2FA Code: {instagram.totp_generate_code(INSTAGRAM_2FA_SEED)}")
