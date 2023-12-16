'''Entry Point'''
from fastapi import FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles

from src.core.app import router as ScrapeRouter
from src.core.app import create_admin_user
from src.core.database import engine, Base, session_local
from src.core.models import User


app = FastAPI()

# static files definitipn
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"]
)


'''spin up the database'''
Base.metadata.create_all(bind=engine)


# Event handler for app startup
@app.on_event("startup")
def on_startup():
    # Check if the admin user already exists
    with session_local() as db:
        admin_user = db.query(User).filter(User.username == "admin").first()

        # If the admin user doesn't exist, create it
        if admin_user is None:
            create_admin_user(db)
app.include_router(ScrapeRouter, prefix="", tags=["fishgrowth"])

@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "message": "Request Body Validation Error",
            "description": "There is atleast one validation error in your request body",
            "detail": jsonable_encoder(exc.errors(), exclude={"url", "type"})
        }
    )

@app.exception_handler(status.HTTP_404_NOT_FOUND)
async def not_found(request: Request, exc) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "message": "Not found",
            "description": "Sorry the requested resource was not found :("
        }
    )