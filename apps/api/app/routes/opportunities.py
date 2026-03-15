from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Query

router = APIRouter(prefix="/api", tags=["Opportunities"])


@router.get("/opportunities")
def list_opportunities(
    type: Optional[str] = Query(None),
    domain: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
):
    return {
        "filters": {"type": type, "domain": domain, "search": search},
        "items": [
            {
                "id": "o1",
                "type": "job",
                "title": "Backend Engineer — Node.js & PostgreSQL",
                "company": "Razorpay",
                "logo": "R",
                "logoGrad": "linear-gradient(135deg,#2563eb,#1d4ed8)",
                "location": "Bangalore, India",
                "mode": "hybrid",
                "tags": ["Node.js", "PostgreSQL", "System Design", "REST API"],
                "desc": "Build and scale payment infrastructure serving millions of transactions. Own backend services end-to-end from design to deployment.",
                "deadline": "2025-05-15",
                "posted": "1d ago",
                "match": 91,
                "applyUrl": "#",
                "featured": True,
                "isNew": True,
            },
            {
                "id": "o2",
                "type": "internship",
                "title": "Software Engineering Intern — Backend",
                "company": "Zepto",
                "logo": "Z",
                "logoGrad": "linear-gradient(135deg,#7c3aed,#a855f7)",
                "location": "Mumbai, India",
                "mode": "onsite",
                "tags": ["Node.js", "MongoDB", "Docker", "Redis"],
                "desc": "6-month internship building microservices for a fast-growing platform. PPO offered to top performers.",
                "deadline": "2025-04-25",
                "posted": "2d ago",
                "match": 87,
                "applyUrl": "#",
                "isNew": True,
            },
        ],
    }


@router.get("/courses")
def list_courses(domain: Optional[str] = Query(None)):
    return {
        "domain": domain,
        "items": [
            {
                "id": "c1",
                "domain": "Backend",
                "title": "Node.js Crash Course — Build REST APIs from Scratch",
                "channel": "Traversy Media",
                "views": "2.1M",
                "duration": "1:30:00",
                "thumbBg": "linear-gradient(135deg,#1e3a5f,#2563eb)",
                "thumbEmoji": "🟢",
                "tag": "Node.js",
                "tagColor": "#10b981",
                "url": "#",
            },
            {
                "id": "c2",
                "domain": "System Design",
                "title": "System Design Interview — Complete Guide for 2025",
                "channel": "Gaurav Sen",
                "views": "5.4M",
                "duration": "2:15:00",
                "thumbBg": "linear-gradient(135deg,#4f1787,#7c3aed)",
                "thumbEmoji": "🏗️",
                "tag": "System Design",
                "tagColor": "#a855f7",
                "url": "#",
            },
        ],
    }
