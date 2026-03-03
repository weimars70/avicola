import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def fix_db():
    try:
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT'),
            user=os.getenv('DB_USERNAME'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME')
        )
        cur = conn.cursor()
        
        print("Executing ALTER TABLE to make fields nullable...")
        cur.execute('ALTER TABLE terceros ALTER COLUMN estrato_codigo DROP NOT NULL;')
        cur.execute('ALTER TABLE terceros ALTER COLUMN ciudad_codigo DROP NOT NULL;')
        conn.commit()
        print("Successfully updated database schema!")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error updating database: {e}")

if __name__ == "__main__":
    fix_db()
