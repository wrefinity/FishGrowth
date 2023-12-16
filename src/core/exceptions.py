from fastapi import HTTPException, status


EXCEPTION_404 = HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail='Invalid credentials Supplied'
)

EXCEPTION_401_PERM = HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail='Permissions'
                )