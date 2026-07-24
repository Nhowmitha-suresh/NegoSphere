from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from app.services.maps_service import maps_service

router = APIRouter(prefix="/maps", tags=["Google Maps & Location Services"])

class RouteOptimizationRequest(BaseModel):
    origin_lat: float
    origin_lng: float
    destinations: List[Dict[str, Any]] # [{"id": "s1", "name": "Store 1", "lat": 28.5, "lng": 77.2, "potential_savings": 2500}]
    optimization_mode: Optional[str] = "max_savings" # max_savings | shortest_time | lowest_fuel

@router.get("/nearby-stores")
async def get_nearby_stores(
    lat: float = Query(28.5494, description="Latitude"),
    lng: float = Query(77.2520, description="Longitude"),
    query: str = Query("electronics", description="Product or store query"),
    radius: int = Query(10000, description="Search radius in meters"),
    type: Optional[str] = Query(None, description="Place type filter")
):
    """
    Search nearby retail stores, wholesale bazaars, repair centers using Google Places API.
    Returns clear message if GOOGLE_MAPS_API_KEY is not set.
    """
    if not maps_service.is_configured:
        return {
            "status": "disabled",
            "message": "Google Maps is not configured. Set GOOGLE_MAPS_API_KEY in environment variables to enable live map services.",
            "maps_configured": False,
            "query": query,
            "count": 0,
            "stores": []
        }

    stores = await maps_service.search_nearby_stores(lat, lng, query, radius, type)
    return {
        "status": "success",
        "maps_configured": True,
        "query": query,
        "center": {"lat": lat, "lng": lng},
        "count": len(stores),
        "stores": stores
    }

@router.get("/directions")
async def get_directions(
    origin_lat: float,
    origin_lng: float,
    dest_lat: float,
    dest_lng: float,
    mode: str = "driving"
):
    """
    Calculate real Google Maps directions, distance, and duration.
    Returns clear message if GOOGLE_MAPS_API_KEY is not set.
    """
    if not maps_service.is_configured:
        return {
            "status": "disabled",
            "message": "Google Maps is not configured. Set GOOGLE_MAPS_API_KEY in environment variables to enable live map services.",
            "maps_configured": False,
            "mode": mode,
            "route": None
        }

    route = await maps_service.get_directions_and_distance(origin_lat, origin_lng, dest_lat, dest_lng, mode)
    return {
        "status": "success",
        "maps_configured": True,
        "mode": mode,
        "route": route
    }

@router.post("/optimize-shopping-route")
async def optimize_shopping_route(req: RouteOptimizationRequest):
    """
    Multi-stop route planning optimized for Maximum Savings, Lowest Time, or Lowest Fuel Cost.
    Returns clear message if GOOGLE_MAPS_API_KEY is not set.
    """
    if not maps_service.is_configured:
        return {
            "status": "disabled",
            "message": "Google Maps is not configured. Set GOOGLE_MAPS_API_KEY in environment variables to enable live map services.",
            "maps_configured": False,
            "optimization_mode": req.optimization_mode,
            "summary": {
                "total_stops": 0,
                "total_distance_km": 0.0,
                "total_estimated_time_mins": 0.0,
                "total_potential_savings": 0.0,
                "total_estimated_fuel_cost": 0.0,
                "net_roi": 0.0
            },
            "optimized_route": []
        }

    if not req.destinations:
        raise HTTPException(status_code=400, detail="At least one destination store is required.")

    # Compute distances to all stores
    annotated_stores = []
    total_savings = 0.0
    
    for idx, dest in enumerate(req.destinations):
        d_lat = dest.get("lat", req.origin_lat + 0.01 * (idx + 1))
        d_lng = dest.get("lng", req.origin_lng + 0.01 * (idx + 1))
        
        dir_info = await maps_service.get_directions_and_distance(
            req.origin_lat, req.origin_lng, d_lat, d_lng
        )
        savings = float(dest.get("potential_savings", 1500.0 * (idx + 1)))
        total_savings += savings
        
        annotated_stores.append({
            "id": dest.get("id", f"dest-{idx}"),
            "name": dest.get("name", f"Retail Store {idx + 1}"),
            "lat": d_lat,
            "lng": d_lng,
            "distance_km": dir_info["distance_km"] if dir_info else 0.0,
            "duration_mins": dir_info["duration_mins"] if dir_info else 0.0,
            "potential_savings": savings,
            "fuel_cost_est": round((dir_info["distance_km"] if dir_info else 0.0) * 8.5, 2),
            "efficiency_score": round((savings / max(1, dir_info["distance_km"] if dir_info else 1)), 2)
        })

    # Sort based on optimization mode
    if req.optimization_mode == "max_savings":
        ordered = sorted(annotated_stores, key=lambda x: x["potential_savings"], reverse=True)
    elif req.optimization_mode == "lowest_fuel":
        ordered = sorted(annotated_stores, key=lambda x: x["fuel_cost_est"])
    else: # shortest_time
        ordered = sorted(annotated_stores, key=lambda x: x["duration_mins"])

    total_dist = sum(s["distance_km"] for s in ordered)
    total_time = sum(s["duration_mins"] for s in ordered)
    total_fuel = sum(s["fuel_cost_est"] for s in ordered)

    return {
        "status": "success",
        "maps_configured": True,
        "optimization_mode": req.optimization_mode,
        "summary": {
            "total_stops": len(ordered),
            "total_distance_km": round(total_dist, 2),
            "total_estimated_time_mins": round(total_time, 1),
            "total_potential_savings": total_savings,
            "total_estimated_fuel_cost": round(total_fuel, 2),
            "net_roi": round(total_savings - total_fuel, 2)
        },
        "optimized_route": ordered
    }
