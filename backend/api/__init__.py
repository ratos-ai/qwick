from fastapi import APIRouter

from .auth import router as auth_router
from .favorites import router as favorites_router

router = APIRouter(prefix="/api")
router.include_router(auth_router)
router.include_router(favorites_router)

__all__ = ["router"]
