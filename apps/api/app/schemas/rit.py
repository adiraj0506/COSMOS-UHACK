from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class RitSubmitRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    cosmos_id: Optional[str] = Field(None, alias="cosmosId")
    product_job: Optional[int] = None
    research: Optional[int] = None
    startup: Optional[int] = None
