import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def cleanup_terceros_ingresos():
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT'),
        user=os.getenv('DB_USERNAME'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )
    cur = conn.cursor()

    # Count first
    cur.execute("SELECT COUNT(*) FROM ingresos WHERE descripcion LIKE '%[origen=terceros]%' AND activo = true;")
    count = cur.fetchone()[0]
    print(f"Found {count} ingresos from Ventas-Terceros to deactivate")

    if count > 0:
        cur.execute("""
            UPDATE ingresos
            SET activo = false
            WHERE descripcion LIKE '%[origen=terceros]%'
            AND activo = true;
        """)
        conn.commit()
        print(f"Successfully deactivated {cur.rowcount} terceros ingresos")
    else:
        print("No cleanup needed")

    cur.close()
    conn.close()

if __name__ == "__main__":
    cleanup_terceros_ingresos()
