"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, Edit2 } from "lucide-react";
import { EnrichedGridFeature } from "@/types/geojson";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeaturesTableProps {
  features: EnrichedGridFeature[];
  loading: boolean;
  collectionId: number | null;
  onEditFeature: (feature: EnrichedGridFeature) => void;
  dictionary: {
    title: string;
    noCollectionTitle: string;
    addButton: string;
    noData: string;
    noDataNote: string;
    table: {
      id: string;
      name: string;
      gridId: string;
      area: string;
      population: string;
      actions: string;
    };
    edit: string;
  };
}

// Swiss design-inspired animation variants
const swissEase = [0.23, 1, 0.32, 1];

const tableRowVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.05,
      duration: 0.4,
      ease: swissEase,
    },
  }),
};

const alertVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: swissEase,
    },
  },
};

export const FeaturesTable: React.FC<FeaturesTableProps> = ({
  features,
  loading,
  collectionId,
  onEditFeature,
  dictionary,
}) => {
  if (!collectionId) {
    return (
      <motion.div variants={alertVariants} initial="hidden" animate="visible">
        <Alert className="bg-muted/50 border-l-4 border-primary">
          <AlertTitle className="text-lg font-medium mb-2">
            {dictionary.noCollectionTitle}
          </AlertTitle>
          <AlertDescription className="text-muted-foreground">
            {dictionary.noDataNote}
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center py-16"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </motion.div>
    );
  }

  if (features.length === 0) {
    return (
      <motion.div variants={alertVariants} initial="hidden" animate="visible">
        <Alert className="bg-muted/50 border-l-4 border-primary">
          <AlertTitle className="text-lg font-medium mb-2">
            {dictionary.noData}
          </AlertTitle>
          <AlertDescription className="text-muted-foreground">
            {dictionary.noDataNote}
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <ScrollArea className="h-[400px] rounded-md border border-muted/20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-medium text-xs uppercase tracking-wider text-muted-foreground/70 w-[80px]">
                {dictionary.table.id}
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-muted-foreground/70">
                {dictionary.table.name}
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-muted-foreground/70 hidden sm:table-cell">
                {dictionary.table.gridId}
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-muted-foreground/70 hidden md:table-cell">
                {dictionary.table.area}
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-muted-foreground/70 hidden md:table-cell">
                {dictionary.table.population}
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-muted-foreground/70 text-right">
                {dictionary.table.actions}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature, index) => (
              <motion.tr
                key={feature.id}
                variants={tableRowVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                className={cn(
                  "border-b border-muted/10 transition-colors",
                  "hover:bg-muted/5"
                )}
                whileHover={{ backgroundColor: "rgba(var(--muted), 0.1)" }}
              >
                <TableCell className="font-mono text-sm">
                  {feature.id}
                </TableCell>
                <TableCell className="font-medium">
                  {feature.properties.name}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {feature.properties.grid_id}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  <span className="font-mono">
                    {feature.properties.area_km2}
                  </span>{" "}
                  km²
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  <span className="font-mono">
                    {feature.properties.population?.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-block"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditFeature(feature)}
                      className="text-foreground/70 hover:text-foreground hover:bg-muted/20 rounded-md"
                    >
                      <Edit2 className="h-4 w-4 mr-1 opacity-70" />
                      {dictionary.edit}
                    </Button>
                  </motion.div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </ScrollArea>
  );
};
