from db import get_connection

def fetch_rule_by_id(rule_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, condition, action FROM rules WHERE id = %s", (rule_id,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()

        if row:
            return {
                "id": row[0],
                "condition": row[1],
                "action": row[2]
            }
        return None

    except Exception as e:
        print(f"Database error: {e}")
        return None
