from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    client_id: Optional[int] = None
    assignee_id: Optional[int] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[str] = Field(None)
    client_id: Optional[int] = None
    assignee_id: Optional[int] = None


class ClientCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    segment: Optional[str] = None
    external_id: Optional[str] = None
