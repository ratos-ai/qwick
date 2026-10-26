from fastapi import APIRouter

from .attractions import router as attractions_router
from .auth import router as auth_router
from .favorites import router as favorites_router

router = APIRouter(prefix="/api")
router.include_router(auth_router)
router.include_router(favorites_router)
router.include_router(attractions_router)

__all__ = ["router"]
