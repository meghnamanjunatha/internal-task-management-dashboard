import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/external", tags=["external"])

EXTERNAL_USERS_URL = "https://jsonplaceholder.typicode.com/users"
REQUEST_TIMEOUT = 10.0


async def fetch_external_users():
    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            response = await client.get(EXTERNAL_USERS_URL)
            response.raise_for_status()
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=502,
            detail="Failed to fetch external users",
        ) from exc

    try:
        users = response.json()

        return [
            {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "phone": user["phone"],
                "company_name": user["company"]["name"],
            }
            for user in users
        ]
    except (KeyError, TypeError, ValueError) as exc:
        raise HTTPException(
            status_code=502,
            detail="Invalid response from external user service",
        ) from exc


@router.get("/users")
async def get_external_users():
    return await fetch_external_users()
