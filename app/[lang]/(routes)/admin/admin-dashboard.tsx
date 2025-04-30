"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { withAuth } from "@/components/hoc/withAuth";
import {
  Upload,
  Plus,
  Grid,
  Users,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { motion, AnimatePresence, Variants } from "framer-motion";

// Import component types
import {
  CollectionList,
  FeatureProperties,
  MultiPolygonGeometry,
} from "@/types/admin";
import { EnrichedGridFeature } from "@/types/geojson";

// Import modular components
import { CollectionsTable } from "@/components/admin/collections-table";
import { FeaturesTable } from "@/components/admin/features-table";
import { UsersTable } from "@/components/admin/users-table";
import { UploadForm } from "@/components/admin/upload-form";
import { RegisterUserForm } from "@/components/admin/register-user-form";
import { FeatureForm } from "@/components/admin/feature-form";

// Import services
import { CollectionsService } from "@/services/collections.service";
import { FeaturesService } from "@/services/features.service";
import { UsersService } from "@/services/users.service";

// Import utility
import { cn } from "@/lib/utils";

interface AdminDashboardProps {
  dictionary: {
    admin: {
      title: string;
      description: string;
      tabs: {
        collections: string;
        features: string;
        users: string;
      };
      collections: {
        title: string;
        uploadButton: string;
        noData: string;
        uploadNote: string;
        table: {
          id: string;
          name: string;
          description: string;
          createdAt: string;
          actions: string;
        };
        viewFeatures: string;
      };
      features: {
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
      users: {
        title: string;
        addButton: string;
        noData: string;
        noDataNote: string;
        table: {
          id: string;
          username: string;
          role: string;
        };
      };
      upload: {
        title: string;
        description: string;
        form: {
          name: string;
          description: string;
          file: string;
        };
        cancel: string;
        submit: string;
        success: string;
      };
      register: {
        title: string;
        description: string;
        form: {
          username: string;
          email: string;
          password: string;
          role: string;
          selectRole: string;
          userRole: string;
          adminRole: string;
        };
        cancel: string;
        submit: string;
        success: string;
      };
      feature: {
        add: {
          title: string;
          description: string;
        };
        edit: {
          title: string;
          description: string;
        };
        form: {
          name: string;
          nameRu: string;
          gridId: string;
          areaKm2: string;
          population: string;
          crimesCount: string;
          camerasCount: string;
          companyCount: string;
          geometry: string;
        };
        cancel: string;
        submit: {
          add: string;
          update: string;
        };
        success: {
          add: string;
          update: string;
        };
      };
      errors: {
        collections?: string;
        features?: string;
        users?: string;
        upload?: string;
        register?: string;
        addFeature?: string;
        updateFeature?: string;
      };
    };
  };
}

// Swiss design-inspired animation variants
const swissEase = [0.23, 1, 0.32, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: swissEase,
      delay: custom * 0.1,
    },
  }),
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: swissEase,
    },
  },
};

const tabContentVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: swissEase,
    },
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: {
      duration: 0.3,
      ease: swissEase,
    },
  },
};

const headerLineVariants: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.8,
      ease: swissEase,
      delay: 0.2,
    },
  },
};

const AdminDashboard = ({ dictionary }: AdminDashboardProps) => {
  const { admin } = dictionary;
  const { accessToken } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState("collections");

  // Data states
  const [collections, setCollections] = useState<CollectionList[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [features, setFeatures] = useState<EnrichedGridFeature[]>([]);

  // UI control states
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCollection, setSelectedCollection] = useState<number | null>(
    null
  );
  const [selectedFeature, setSelectedFeature] =
    useState<EnrichedGridFeature | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Dialog states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAddFeatureOpen, setIsAddFeatureOpen] = useState(false);
  const [isEditFeatureOpen, setIsEditFeatureOpen] = useState(false);

  // Load initial data based on active tab
  useEffect(() => {
    if (activeTab === "collections") {
      fetchCollections();
    } else if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab, accessToken]);

  // Fetch data methods using services
  const fetchCollections = async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const data = await CollectionsService.getCollections(accessToken);
      setCollections(data);
    } catch (error: any) {
      console.error("Error fetching collections:", error);
      toast.error("Error", {
        description:
          error.message ||
          admin.errors.collections ||
          "Error fetching collections",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const data = await UsersService.getUsers(accessToken);
      setUsers(data);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Error", {
        description:
          error.message || admin.errors.users || "Error fetching users",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatures = async (collectionId: number) => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const data = await FeaturesService.getFeaturesByCollection(
        collectionId,
        accessToken
      );
      setFeatures(data);
    } catch (error: any) {
      console.error("Error fetching features:", error);
      toast.error("Error", {
        description:
          error.message || admin.errors.features || "Error fetching features",
      });
    } finally {
      setLoading(false);
    }
  };

  // Event handlers
  const handleViewFeatures = (collectionId: number) => {
    setSelectedCollection(collectionId);
    setActiveTab("features");
    fetchFeatures(collectionId);
  };

  const handleEditFeature = (feature: EnrichedGridFeature) => {
    setSelectedFeature(feature);
    setIsEditFeatureOpen(true);
  };

  // Form submission handlers
  const handleUploadSubmit = async (data: {
    name: string;
    description: string;
    file: File;
  }) => {
    if (!accessToken) return;

    setErrorMessage("");
    setLoading(true);

    try {
      await CollectionsService.uploadGeoJSON(accessToken, data);

      toast.success("Success", {
        description: admin.upload.success,
      });

      setIsUploadOpen(false);
      fetchCollections();
    } catch (error: any) {
      console.error("Error uploading file:", error);
      setErrorMessage(
        error.message || admin.errors.upload || "Error uploading file"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterUser = async (data: {
    username: string;
    email: string;
    password: string;
    role: string;
  }) => {
    if (!accessToken) return;

    setErrorMessage("");
    setLoading(true);

    try {
      await UsersService.registerUser(data, accessToken);

      toast.success("Success", {
        description: admin.register.success,
      });

      setIsAddUserOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error("Error registering user:", error);
      setErrorMessage(
        error.message || admin.errors.register || "Error registering user"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = async (data: {
    properties: Partial<FeatureProperties>;
    geometry: MultiPolygonGeometry | null;
  }) => {
    if (!accessToken || !selectedCollection) {
      setErrorMessage("No collection selected or not authenticated");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      await FeaturesService.addFeature(selectedCollection, data, accessToken);

      toast.success("Success", {
        description: admin.feature.success.add,
      });

      setIsAddFeatureOpen(false);
      fetchFeatures(selectedCollection);
    } catch (error: any) {
      console.error("Error adding feature:", error);
      setErrorMessage(
        error.message || admin.errors.addFeature || "Error adding feature"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFeature = async (data: {
    properties: Partial<FeatureProperties>;
    geometry: MultiPolygonGeometry | null;
  }) => {
    if (!accessToken || !selectedFeature || !selectedFeature.id) {
      setErrorMessage("No feature selected for update or not authenticated");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      await FeaturesService.updateFeature(
        selectedFeature.id,
        data,
        accessToken
      );

      toast.success("Success", {
        description: admin.feature.success.update,
      });

      setIsEditFeatureOpen(false);
      if (selectedCollection) {
        fetchFeatures(selectedCollection);
      }
      setSelectedFeature(null);
    } catch (error: any) {
      console.error("Error updating feature:", error);
      setErrorMessage(
        error.message || admin.errors.updateFeature || "Error updating feature"
      );
    } finally {
      setLoading(false);
    }
  };

  // Format strings with placeholders
  const formatString = (str: string, params: Record<string, any>) => {
    return str.replace(/\{([^}]+)\}/g, (_, key) => params[key] || "");
  };

  // Swiss-inspired button styling with motion
  const SwissButton = ({
    children,
    onClick,
    icon,
    variant = "default",
  }: {
    children: React.ReactNode;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: "default" | "outline";
  }) => (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant={variant}
        onClick={onClick}
        className={cn(
          "transition-all duration-300 font-medium tracking-wide ",
          variant === "default" ? "px-5 py-6 h-auto" : "px-4 py-5 h-auto"
        )}
      >
        {icon}
        {children}
      </Button>
    </motion.div>
  );

  const renderTabIcon = (tabName: string) => {
    switch (tabName) {
      case "collections":
        return <Grid className="mr-2 h-4 w-4" />;
      case "features":
        return <ChevronRight className="mr-2 h-4 w-4" />;
      case "users":
        return <Users className="mr-2 h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-16 px-4 sm:px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        <div className="space-y-2">
          <motion.h1
            variants={itemVariants}
            custom={0}
            className="text-4xl font-bold tracking-tight"
          >
            {admin.title}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            custom={1}
            className="text-muted-foreground max-w-3xl"
          >
            {admin.description}
          </motion.p>

          <motion.div
            variants={headerLineVariants}
            className="w-24 h-1 bg-foreground mt-6"
          />
        </div>

        <motion.div variants={cardVariants}>
          <Card className="border-0 shadow-lg bg-card overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-muted/50 p-4 border-b">
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Tabs
                    defaultValue="collections"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/90">
                      {["collections", "features", "users"].map((tab) => (
                        <motion.div
                          key={tab}
                          whileHover={{
                            backgroundColor: "rgba(255,255,255,0.1)",
                            transition: { duration: 0.2 },
                          }}
                          whileTap={{ scale: 0.97 }}
                          className="w-full h-full"
                        >
                          <TabsTrigger
                            value={tab}
                            className={cn(
                              "data-[state=active]:bg-background data-[state=active]:text-foreground w-full h-full py-3",
                              "transition-all duration-300 uppercase tracking-wide text-xs font-medium "
                            )}
                          >
                            {renderTabIcon(tab)}
                            {admin.tabs[tab as keyof typeof admin.tabs]}
                          </TabsTrigger>
                        </motion.div>
                      ))}
                    </TabsList>

                    <div className="mt-8 px-4 pb-6">
                      <AnimatePresence mode="wait">
                        {/* Collections Tab Content */}
                        {activeTab === "collections" && (
                          <TabsContent
                            value="collections"
                            className="mt-0 space-y-6"
                          >
                            <motion.div
                              key="collections-content"
                              variants={tabContentVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="space-y-6"
                            >
                              <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-foreground tracking-tight">
                                  {admin.collections.title}
                                </h3>

                                <SwissButton
                                  onClick={() => setIsUploadOpen(true)}
                                  icon={<Upload className="mr-2 h-4 w-4" />}
                                >
                                  {admin.collections.uploadButton}
                                </SwissButton>
                              </div>

                              <CollectionsTable
                                collections={collections}
                                loading={loading}
                                onViewFeatures={handleViewFeatures}
                                dictionary={admin.collections}
                              />
                            </motion.div>
                          </TabsContent>
                        )}

                        {/* Features Tab Content */}
                        {activeTab === "features" && (
                          <TabsContent
                            value="features"
                            className="mt-0 space-y-6"
                          >
                            <motion.div
                              key="features-content"
                              variants={tabContentVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="space-y-6"
                            >
                              <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-foreground tracking-tight">
                                  {selectedCollection
                                    ? formatString(admin.features.title, {
                                        id: selectedCollection,
                                      })
                                    : admin.features.noCollectionTitle}
                                </h3>

                                {selectedCollection && (
                                  <SwissButton
                                    onClick={() => setIsAddFeatureOpen(true)}
                                    icon={<Plus className="mr-2 h-4 w-4" />}
                                  >
                                    {admin.features.addButton}
                                  </SwissButton>
                                )}
                              </div>

                              <FeaturesTable
                                features={features}
                                loading={loading}
                                collectionId={selectedCollection}
                                onEditFeature={handleEditFeature}
                                dictionary={admin.features}
                              />
                            </motion.div>
                          </TabsContent>
                        )}

                        {/* Users Tab Content */}
                        {activeTab === "users" && (
                          <TabsContent value="users" className="mt-0 space-y-6">
                            <motion.div
                              key="users-content"
                              variants={tabContentVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="space-y-6"
                            >
                              <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-foreground tracking-tight">
                                  {admin.users.title}
                                </h3>

                                <SwissButton
                                  onClick={() => setIsAddUserOpen(true)}
                                  icon={<Plus className="mr-2 h-4 w-4" />}
                                >
                                  {admin.users.addButton}
                                </SwissButton>
                              </div>

                              <UsersTable
                                users={users}
                                loading={loading}
                                dictionary={admin.users}
                              />
                            </motion.div>
                          </TabsContent>
                        )}
                      </AnimatePresence>
                    </div>
                  </Tabs>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Upload GeoJSON Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{admin.upload.title}</DialogTitle>
            <DialogDescription>{admin.upload.description}</DialogDescription>
          </DialogHeader>

          <UploadForm
            onSubmit={handleUploadSubmit}
            onCancel={() => setIsUploadOpen(false)}
            isLoading={loading}
            error={errorMessage}
            dictionary={admin.upload}
          />
        </DialogContent>
      </Dialog>

      {/* Register User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{admin.register.title}</DialogTitle>
            <DialogDescription>{admin.register.description}</DialogDescription>
          </DialogHeader>

          <RegisterUserForm
            onSubmit={handleRegisterUser}
            onCancel={() => setIsAddUserOpen(false)}
            isLoading={loading}
            error={errorMessage}
            dictionary={admin.register}
          />
        </DialogContent>
      </Dialog>

      {/* Add Feature Dialog */}
      <Dialog open={isAddFeatureOpen} onOpenChange={setIsAddFeatureOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{admin.feature.add.title}</DialogTitle>
            <DialogDescription>
              {formatString(admin.feature.add.description, {
                id: selectedCollection,
              })}
            </DialogDescription>
          </DialogHeader>

          <FeatureForm
            onSubmit={handleAddFeature}
            onCancel={() => setIsAddFeatureOpen(false)}
            isLoading={loading}
            error={errorMessage}
            isEditing={false}
            dictionary={admin.feature}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Feature Dialog */}
      <Dialog open={isEditFeatureOpen} onOpenChange={setIsEditFeatureOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{admin.feature.edit.title}</DialogTitle>
            <DialogDescription>
              {formatString(admin.feature.edit.description, {
                id: selectedFeature?.id,
              })}
            </DialogDescription>
          </DialogHeader>

          <FeatureForm
            onSubmit={handleUpdateFeature}
            onCancel={() => setIsEditFeatureOpen(false)}
            isLoading={loading}
            error={errorMessage}
            feature={selectedFeature}
            isEditing={true}
            dictionary={admin.feature}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default withAuth(AdminDashboard);
