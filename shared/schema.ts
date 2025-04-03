import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("user"),
  agency: text("agency"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  role: true,
  agency: true,
});

// Incidents schema
export const incidents = pgTable("incidents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  coordinates: jsonb("coordinates").notNull(), // { lat: number, lng: number }
  incidentType: text("incident_type").notNull(),
  severity: text("severity").notNull(),
  status: text("status").notNull().default("active"),
  reportedBy: integer("reported_by").notNull(),
  reportedAt: timestamp("reported_at").defaultNow().notNull(),
  verifiedBy: integer("verified_by"),
  verifiedAt: timestamp("verified_at"),
  affectedPopulation: integer("affected_population"),
  mediaLinks: jsonb("media_links"), // Array of links
  tags: jsonb("tags"), // Array of tags
});

export const insertIncidentSchema = createInsertSchema(incidents).pick({
  title: true,
  description: true,
  location: true,
  coordinates: true,
  incidentType: true,
  severity: true,
  status: true,
  reportedBy: true,
  affectedPopulation: true,
  mediaLinks: true,
  tags: true,
});

// Call logs schema
export const callLogs = pgTable("call_logs", {
  id: serial("id").primaryKey(),
  callerName: text("caller_name").notNull(),
  contactNumber: text("contact_number").notNull(),
  location: text("location").notNull(),
  incidentType: text("incident_type").notNull(),
  severity: text("severity").notNull(),
  description: text("description").notNull(),
  immediateActions: jsonb("immediate_actions"), // Array of actions
  loggedBy: integer("logged_by").notNull(),
  loggedAt: timestamp("logged_at").defaultNow().notNull(),
  status: text("status").notNull().default("pending"),
  relatedIncidentId: integer("related_incident_id"),
});

export const insertCallLogSchema = createInsertSchema(callLogs).pick({
  callerName: true,
  contactNumber: true,
  location: true,
  incidentType: true,
  severity: true,
  description: true,
  immediateActions: true,
  loggedBy: true,
  status: true,
  relatedIncidentId: true,
});

// Alerts schema
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  alertType: text("alert_type").notNull(),
  severity: text("severity").notNull(),
  source: text("source").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  status: text("status").notNull().default("active"),
  relatedIncidentId: integer("related_incident_id"),
  sentTo: jsonb("sent_to"), // Array of user/agency IDs
});

export const insertAlertSchema = createInsertSchema(alerts).pick({
  title: true,
  description: true,
  alertType: true,
  severity: true,
  source: true,
  expiresAt: true,
  status: true,
  relatedIncidentId: true,
  sentTo: true,
});

// Social media trends schema
export const socialTrends = pgTable("social_trends", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  keyword: text("keyword").notNull(),
  volume: integer("volume").notNull(),
  sentiment: real("sentiment"), // -1 to 1 score
  location: text("location"),
  source: text("source").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  relatedIncidentTypes: jsonb("related_incident_types"), // Array of incident types
});

export const insertSocialTrendSchema = createInsertSchema(socialTrends).pick({
  platform: true,
  keyword: true,
  volume: true,
  sentiment: true,
  location: true,
  source: true,
  relatedIncidentTypes: true,
});

// Response plans schema
export const responsePlans = pgTable("response_plans", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  incidentType: text("incident_type").notNull(),
  severity: text("severity").notNull(),
  steps: jsonb("steps").notNull(), // Array of step objects
  contactAgencies: jsonb("contact_agencies").notNull(), // Array of agency objects
  resources: jsonb("resources"), // Array of resource objects
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});

export const insertResponsePlanSchema = createInsertSchema(responsePlans).pick({
  title: true,
  description: true,
  incidentType: true,
  severity: true,
  steps: true,
  contactAgencies: true,
  resources: true,
  createdBy: true,
});

// Constants and types
export const SEVERITY_LEVELS = ['critical', 'high', 'medium', 'low'] as const;
export const INCIDENT_TYPES = [
  'banditry', 
  'militancy', 
  'secession', 
  'farmer-herder', 
  'political', 
  'boundary', 
  'communal',
  'other'
] as const;
export const INCIDENT_STATUS = ['active', 'investigating', 'resolved', 'closed'] as const;
export const USER_ROLES = ['admin', 'user', 'analyst', 'responder', 'call_agent'] as const;
export const SOCIAL_PLATFORMS = ['twitter', 'facebook', 'instagram', 'tiktok', 'whatsapp', 'other'] as const;

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type CallLog = typeof callLogs.$inferSelect;
export type InsertCallLog = z.infer<typeof insertCallLogSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type SocialTrend = typeof socialTrends.$inferSelect;
export type InsertSocialTrend = z.infer<typeof insertSocialTrendSchema>;
export type ResponsePlan = typeof responsePlans.$inferSelect;
export type InsertResponsePlan = z.infer<typeof insertResponsePlanSchema>;
