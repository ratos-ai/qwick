from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from .config import settings

engine = create_async_engine(url=settings.DB_URL, echo=settings.DB_ECHO)
AsyncSessionFactory = async_sessionmaker(engine)


async def get_db():
    async with AsyncSessionFactory() as session:
        yield session
