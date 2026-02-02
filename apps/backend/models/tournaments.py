from sqlalchemy import Column, String, Integer, Date, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()
DB_URL = os.getenv("DATABASE_URL")

Base = declarative_base()
engine = create_engine(DB_URL)
Session = sessionmaker(bind=engine)

class VolleyTournament(Base):
    __tablename__ = "volley_tournaments"

    id = Column(Integer, primary_key=True)
    code = Column(String, unique=True, nullable=False)
    season = Column(String)
    country_code = Column(String)
    name = Column(String)
    gender = Column(String)
    event_logos = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    organizer_type = Column(String)
    type = Column(String)
    website = Column(String)
    no = Column(String)
    version = Column(String)

class BeachTournament(Base):
    __tablename__ = "beach_tournaments"

    id = Column(Integer, primary_key=True)
    code = Column(String, unique=True, nullable=False)
    season = Column(String)
    country_code = Column(String)
    name = Column(String)
    gender = Column(String)
    event_logos = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    organizer_type = Column(String)
    type = Column(String)
    website = Column(String)
    no = Column(String)
    version = Column(String)

# Delete tables if they exist
Base.metadata.drop_all(engine)
# Create tables if they don't exist
Base.metadata.create_all(engine)