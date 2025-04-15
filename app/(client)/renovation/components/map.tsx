"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import {
  strategies,
  property_characteristics,
  strategy_info,
} from "@/data/data_renovation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Mapbox API key
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// Property data type
interface PropertyData {
  id: string;
  name: string;
  cost: string;
  siteData?: {
    rowsbusiness: { name: string; value: string; info: string }[];
    rowsresidents: { name: string; value: string; info: string }[];
    rowsbalanced: { name: string; value: string; info: string }[];
  };
}

const Map: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to get key property metrics for display in the popup
  const getKeyMetrics = (
    rows: { name: string; value: string; info: string }[]
  ) => {
    const metrics = [
      rows.find((row) => row.name.includes("Площадь")),
      rows.find((row) => row.name.includes("Население")),
      rows.find((row) => row.name.includes("Плотность населения")),
      rows.find((row) => row.name.includes("Коммерческих помещений")),
    ].filter(Boolean);

    return metrics;
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11", // Updated to a cleaner style
      center: [76.9286, 43.2567], // Almaty
      zoom: 10,
    });

    const map = mapRef.current;

    // When map loads
    map.on("load", async () => {
      try {
        // Load Almaty city boundary from real GeoJSON data
        const almaty_response = await fetch(
          "https://raw.githubusercontent.com/akilbekov/almaty.geo.json/master/almaty-districts.geo.json"
        );
        const almaty_data = await almaty_response.json();

        // Add Almaty boundary source
        map.addSource("almaty-boundary", {
          type: "geojson",
          data: almaty_data,
        });

        // Add Almaty boundary layer
        map.addLayer({
          id: "almaty-boundary-fill",
          type: "fill",
          source: "almaty-boundary",
          layout: {},
          paint: {
            "fill-color": "#2563eb", // Blue color for Almaty
            "fill-opacity": 0.2,
            "fill-outline-color": "#1e40af",
          },
        });

        // Add Almaty outline layer
        map.addLayer({
          id: "almaty-boundary-outline",
          type: "line",
          source: "almaty-boundary",
          paint: {
            "line-color": "#1e40af",
            "line-width": 1.5,
          },
        });

        // Load renovation GeoJSON data
        const response = await fetch("/renovation.geojson");
        const data = await response.json();

        // Add source
        if (!map.getSource("renovation-source")) {
          map.addSource("renovation-source", {
            type: "geojson",
            data,
          });
        }

        // Add fill layer (now green for areas with data)
        if (!map.getLayer("renovation-layer")) {
          map.addLayer({
            id: "renovation-layer",
            type: "fill",
            source: "renovation-source",
            paint: {
              "fill-color": "#16a34a", // Green for areas with data
              "fill-opacity": 0.5,
              "fill-outline-color": "#166534",
            },
          });
        }

        // Add outline layer
        if (!map.getLayer("renovation-layer-outline")) {
          map.addLayer({
            id: "renovation-layer-outline",
            type: "line",
            source: "renovation-source",
            paint: {
              "line-color": "#166534", // Darker green for outline
              "line-width": 2,
            },
          });
        }

        // Add hover effect layer
        if (!map.getLayer("renovation-layer-hover")) {
          map.addLayer({
            id: "renovation-layer-hover",
            type: "fill",
            source: "renovation-source",
            paint: {
              "fill-color": "#22c55e", // Lighter green for hover
              "fill-opacity": 0,
            },
          });
        }

        // Handle click on area
        map.on("click", "renovation-layer", (e) => {
          if (!e.features?.length) return;

          const feature = e.features[0];
          const featureId = feature.properties?.id;

          if (!featureId) return;

          // Convert to string for data lookup
          const key = String(featureId);

          // Get data for the selected property
          const siteData = strategies[key as keyof typeof strategies];
          const characteristic = property_characteristics.find(
            (p) => p.id === key
          );

          if (!characteristic) return;

          // Create property data object
          const propertyData: PropertyData = {
            id: key,
            name: characteristic.name,
            cost: characteristic.cost,
            siteData: siteData,
          };

          // Store selected property data
          setSelectedProperty(propertyData);

          // Create popup content
          let popupContent = document.createElement("div");
          popupContent.className = "area-popup";

          // Render basic popup HTML
          const title =
            feature.properties?.["Участок"] || `Участок #${featureId}`;

          popupContent.innerHTML = `
            <div class="p-2">
              <h3 class="text-lg font-bold mb-1">${title}</h3>
              <p class="text-sm mb-2">Стоимость: <span class="font-semibold">${
                characteristic.cost
              } тыс.</span></p>
              ${
                siteData
                  ? `
                <div class="mb-2">
                  <p class="text-xs text-gray-500 mb-1">Основные характеристики:</p>
                  <p class="text-sm">Площадь: <span class="font-medium">${siteData.rowsbalanced[0].value}</span></p>
                  <p class="text-sm">Население: <span class="font-medium">${siteData.rowsbalanced[1].value}</span></p>
                </div>
              `
                  : '<p class="text-sm text-red-500">Нет данных</p>'
              }
              <button id="show-details" class="text-sm text-green-600 hover:text-green-800 font-medium">
                Показать подробности →
              </button>
            </div>
          `;

          // Create popup
          const popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: false,
            maxWidth: "300px",
            className: "custom-popup",
          })
            .setLngLat(e.lngLat)
            .setDOMContent(popupContent)
            .addTo(map);

          // Add event listener to the "show details" button
          const detailsButton = popupContent.querySelector("#show-details");
          if (detailsButton) {
            detailsButton.addEventListener("click", () => {
              setIsDialogOpen(true);
              popup.remove();
            });
          }
        });

        // Change cursor on hover
        map.on("mouseenter", "renovation-layer", () => {
          map.getCanvas().style.cursor = "pointer";
          map.setPaintProperty("renovation-layer-hover", "fill-opacity", 0.3);
        });

        map.on("mouseleave", "renovation-layer", () => {
          map.getCanvas().style.cursor = "";
          map.setPaintProperty("renovation-layer-hover", "fill-opacity", 0);
        });
      } catch (err) {
        console.error("Error loading GeoJSON:", err);
      }
    });

    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Helper function to render a data card for a strategy
  const renderStrategyCard = (
    rows: { name: string; value: string; info: string }[],
    strategyType: string
  ) => {
    if (!rows || !rows.length) return null;

    const strategyInfo = strategy_info.find((s) => s.name === strategyType);

    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{strategyType}</CardTitle>
          {strategyInfo && (
            <CardDescription>{strategyInfo.info}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {rows.slice(0, 8).map((row, index) => (
              <div key={index} className="mb-2">
                <p className="text-sm text-gray-500">{row.name}</p>
                <p className="text-base font-medium">{row.value}</p>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-2">
            {rows.slice(8, 15).map((row, index) => (
              <div key={index} className="mb-2">
                <p className="text-sm text-gray-500">{row.name}</p>
                <p className="text-base font-medium">{row.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        className="w-full h-[700px] rounded-lg border border-gray-200 shadow-sm overflow-hidden"
      />

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProperty?.name}
              <Badge variant="outline" className="ml-2 text-green-600">
                {selectedProperty?.cost} тыс.
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {selectedProperty?.siteData ? (
            <Tabs defaultValue="balanced" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="business">Для бизнеса</TabsTrigger>
                <TabsTrigger value="residents">Для жителей</TabsTrigger>
                <TabsTrigger value="balanced">Сбалансированная</TabsTrigger>
              </TabsList>

              <TabsContent value="business">
                {renderStrategyCard(
                  selectedProperty?.siteData.rowsbusiness,
                  "Для бизнеса"
                )}
              </TabsContent>

              <TabsContent value="residents">
                {renderStrategyCard(
                  selectedProperty?.siteData.rowsresidents,
                  "Для жителей"
                )}
              </TabsContent>

              <TabsContent value="balanced">
                {renderStrategyCard(
                  selectedProperty?.siteData.rowsbalanced,
                  "Сбалансированная"
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <p className="text-red-500">
              Нет данных по стратегиям для этого участка
            </p>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Map;
