from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import text
import redis.asyncio as aioredis
import structlog
from app.database import get_db, get_redis

logger = structlog.get_logger()
router = APIRouter(prefix="/health", tags=["infrastructure"])

@router.get("", status_code=status.HTTP_200_OK)
async def check_health(
    db: AsyncSession = Depends(get_db),
    redis: aioredis.Redis = Depends(get_redis)
):
    health_status = {"status": "healthy", "components": {}}
    
    try:
        await db.execute(text("SELECT 1"))
        health_status["components"]["database"] = "up"
    except Exception as e:
        logger.error("database_health_check_failed", error=str(e))
        health_status["components"]["database"] = "down"
        health_status["status"] = "unhealthy"

    try:
        await redis.ping()
        health_status["components"]["redis"] = "up"
    except Exception as e:
        logger.error("redis_health_check_failed", error=str(e))
        health_status["components"]["redis"] = "down"
        health_status["status"] = "unhealthy"

    if health_status["status"] != "healthy":
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=health_status
        )
        
    return health_status
