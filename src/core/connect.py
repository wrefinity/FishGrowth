from src.core.database import session_local


# connect database
def get_db():
    try:
        db = session_local()
        yield db
    finally:
        db.close()