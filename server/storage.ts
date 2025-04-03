import { 
  users, User, InsertUser, 
  incidents, Incident, InsertIncident,
  callLogs, CallLog, InsertCallLog,
  alerts, Alert, InsertAlert,
  socialTrends, SocialTrend, InsertSocialTrend,
  responsePlans, ResponsePlan, InsertResponsePlan
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;

  // Incident operations
  getIncident(id: number): Promise<Incident | undefined>;
  getIncidents(limit?: number): Promise<Incident[]>;
  createIncident(incident: InsertIncident): Promise<Incident>;
  updateIncident(id: number, incident: Partial<InsertIncident>): Promise<Incident | undefined>;
  deleteIncident(id: number): Promise<boolean>;

  // Call log operations
  getCallLog(id: number): Promise<CallLog | undefined>;
  getCallLogs(limit?: number): Promise<CallLog[]>;
  createCallLog(callLog: InsertCallLog): Promise<CallLog>;
  updateCallLog(id: number, callLog: Partial<InsertCallLog>): Promise<CallLog | undefined>;
  deleteCallLog(id: number): Promise<boolean>;

  // Alert operations
  getAlert(id: number): Promise<Alert | undefined>;
  getAlerts(limit?: number): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: number, alert: Partial<InsertAlert>): Promise<Alert | undefined>;
  deleteAlert(id: number): Promise<boolean>;

  // Social trend operations
  getSocialTrend(id: number): Promise<SocialTrend | undefined>;
  getSocialTrends(limit?: number): Promise<SocialTrend[]>;
  createSocialTrend(socialTrend: InsertSocialTrend): Promise<SocialTrend>;
  updateSocialTrend(id: number, socialTrend: Partial<InsertSocialTrend>): Promise<SocialTrend | undefined>;
  deleteSocialTrend(id: number): Promise<boolean>;

  // Response plan operations
  getResponsePlan(id: number): Promise<ResponsePlan | undefined>;
  getResponsePlans(limit?: number): Promise<ResponsePlan[]>;
  createResponsePlan(responsePlan: InsertResponsePlan): Promise<ResponsePlan>;
  updateResponsePlan(id: number, responsePlan: Partial<InsertResponsePlan>): Promise<ResponsePlan | undefined>;
  deleteResponsePlan(id: number): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private incidents: Map<number, Incident>;
  private callLogs: Map<number, CallLog>;
  private alerts: Map<number, Alert>;
  private socialTrends: Map<number, SocialTrend>;
  private responsePlans: Map<number, ResponsePlan>;
  
  private userCurrentId: number;
  private incidentCurrentId: number;
  private callLogCurrentId: number;
  private alertCurrentId: number;
  private socialTrendCurrentId: number;
  private responsePlanCurrentId: number;

  constructor() {
    this.users = new Map();
    this.incidents = new Map();
    this.callLogs = new Map();
    this.alerts = new Map();
    this.socialTrends = new Map();
    this.responsePlans = new Map();
    
    this.userCurrentId = 1;
    this.incidentCurrentId = 1;
    this.callLogCurrentId = 1;
    this.alertCurrentId = 1;
    this.socialTrendCurrentId = 1;
    this.responsePlanCurrentId = 1;

    // Initialize with admin user
    this.createUser({
      username: 'admin',
      password: 'Admin123',
      fullName: 'Admin User',
      email: 'admin@ipcr.gov.ng',
      role: 'admin',
      agency: 'IPCR'
    });

    // Initialize sample data
    this.initializeSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  // Incident operations
  async getIncident(id: number): Promise<Incident | undefined> {
    return this.incidents.get(id);
  }

  async getIncidents(limit?: number): Promise<Incident[]> {
    const incidents = Array.from(this.incidents.values());
    if (limit) {
      return incidents.slice(0, limit);
    }
    return incidents;
  }

  async createIncident(insertIncident: InsertIncident): Promise<Incident> {
    const id = this.incidentCurrentId++;
    const now = new Date();
    const incident: Incident = {
      ...insertIncident,
      id,
      reportedAt: now,
      verifiedBy: null,
      verifiedAt: null
    };
    this.incidents.set(id, incident);
    return incident;
  }

  async updateIncident(id: number, incidentData: Partial<InsertIncident>): Promise<Incident | undefined> {
    const incident = this.incidents.get(id);
    if (!incident) return undefined;
    
    const updatedIncident = { ...incident, ...incidentData };
    this.incidents.set(id, updatedIncident);
    return updatedIncident;
  }

  async deleteIncident(id: number): Promise<boolean> {
    return this.incidents.delete(id);
  }

  // Call log operations
  async getCallLog(id: number): Promise<CallLog | undefined> {
    return this.callLogs.get(id);
  }

  async getCallLogs(limit?: number): Promise<CallLog[]> {
    const callLogs = Array.from(this.callLogs.values());
    if (limit) {
      return callLogs.slice(0, limit);
    }
    return callLogs;
  }

  async createCallLog(insertCallLog: InsertCallLog): Promise<CallLog> {
    const id = this.callLogCurrentId++;
    const now = new Date();
    const callLog: CallLog = {
      ...insertCallLog,
      id,
      loggedAt: now
    };
    this.callLogs.set(id, callLog);
    return callLog;
  }

  async updateCallLog(id: number, callLogData: Partial<InsertCallLog>): Promise<CallLog | undefined> {
    const callLog = this.callLogs.get(id);
    if (!callLog) return undefined;
    
    const updatedCallLog = { ...callLog, ...callLogData };
    this.callLogs.set(id, updatedCallLog);
    return updatedCallLog;
  }

  async deleteCallLog(id: number): Promise<boolean> {
    return this.callLogs.delete(id);
  }

  // Alert operations
  async getAlert(id: number): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  async getAlerts(limit?: number): Promise<Alert[]> {
    const alerts = Array.from(this.alerts.values());
    if (limit) {
      return alerts.slice(0, limit);
    }
    return alerts;
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = this.alertCurrentId++;
    const now = new Date();
    const alert: Alert = {
      ...insertAlert,
      id,
      createdAt: now
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async updateAlert(id: number, alertData: Partial<InsertAlert>): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    
    const updatedAlert = { ...alert, ...alertData };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }

  async deleteAlert(id: number): Promise<boolean> {
    return this.alerts.delete(id);
  }

  // Social trend operations
  async getSocialTrend(id: number): Promise<SocialTrend | undefined> {
    return this.socialTrends.get(id);
  }

  async getSocialTrends(limit?: number): Promise<SocialTrend[]> {
    const socialTrends = Array.from(this.socialTrends.values());
    if (limit) {
      return socialTrends.slice(0, limit);
    }
    return socialTrends;
  }

  async createSocialTrend(insertSocialTrend: InsertSocialTrend): Promise<SocialTrend> {
    const id = this.socialTrendCurrentId++;
    const now = new Date();
    const socialTrend: SocialTrend = {
      ...insertSocialTrend,
      id,
      createdAt: now
    };
    this.socialTrends.set(id, socialTrend);
    return socialTrend;
  }

  async updateSocialTrend(id: number, socialTrendData: Partial<InsertSocialTrend>): Promise<SocialTrend | undefined> {
    const socialTrend = this.socialTrends.get(id);
    if (!socialTrend) return undefined;
    
    const updatedSocialTrend = { ...socialTrend, ...socialTrendData };
    this.socialTrends.set(id, updatedSocialTrend);
    return updatedSocialTrend;
  }

  async deleteSocialTrend(id: number): Promise<boolean> {
    return this.socialTrends.delete(id);
  }

  // Response plan operations
  async getResponsePlan(id: number): Promise<ResponsePlan | undefined> {
    return this.responsePlans.get(id);
  }

  async getResponsePlans(limit?: number): Promise<ResponsePlan[]> {
    const responsePlans = Array.from(this.responsePlans.values());
    if (limit) {
      return responsePlans.slice(0, limit);
    }
    return responsePlans;
  }

  async createResponsePlan(insertResponsePlan: InsertResponsePlan): Promise<ResponsePlan> {
    const id = this.responsePlanCurrentId++;
    const now = new Date();
    const responsePlan: ResponsePlan = {
      ...insertResponsePlan,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.responsePlans.set(id, responsePlan);
    return responsePlan;
  }

  async updateResponsePlan(id: number, responsePlanData: Partial<InsertResponsePlan>): Promise<ResponsePlan | undefined> {
    const responsePlan = this.responsePlans.get(id);
    if (!responsePlan) return undefined;
    
    const now = new Date();
    const updatedResponsePlan = { 
      ...responsePlan, 
      ...responsePlanData,
      updatedAt: now 
    };
    this.responsePlans.set(id, updatedResponsePlan);
    return updatedResponsePlan;
  }

  async deleteResponsePlan(id: number): Promise<boolean> {
    return this.responsePlans.delete(id);
  }

  // Initialize sample data for testing
  private initializeSampleData() {
    // Create some incidents
    this.createIncident({
      title: "Armed Conflict Escalation",
      description: "Reports of armed clashes between militant groups and military in northern Borno state.",
      location: "Borno State",
      coordinates: { lat: 11.8496, lng: 13.1571 },
      incidentType: "militancy",
      severity: "critical",
      status: "active",
      reportedBy: 1,
      affectedPopulation: 5000,
      mediaLinks: ["https://example.com/report1.pdf"],
      tags: ["armed", "military", "conflict"]
    });

    this.createIncident({
      title: "Farmer-Herder Conflict",
      description: "Clashes between farmers and herders in Benue state resulting in casualties",
      location: "Benue State",
      coordinates: { lat: 7.7322, lng: 8.5391 },
      incidentType: "farmer-herder",
      severity: "high",
      status: "investigating",
      reportedBy: 1,
      affectedPopulation: 2000,
      mediaLinks: ["https://example.com/report2.pdf"],
      tags: ["farmers", "herders", "land", "conflict"]
    });

    this.createIncident({
      title: "Political Tensions",
      description: "Political rallies turning violent in southwestern states",
      location: "Lagos State",
      coordinates: { lat: 6.5244, lng: 3.3792 },
      incidentType: "political",
      severity: "medium",
      status: "active",
      reportedBy: 1,
      affectedPopulation: 10000,
      mediaLinks: ["https://example.com/report3.pdf"],
      tags: ["political", "rally", "elections"]
    });

    // Create some alerts
    this.createAlert({
      title: "Armed Conflict Escalation",
      description: "Reports of armed clashes between militant groups and military in northern Borno state.",
      alertType: "security",
      severity: "critical",
      source: "field_report",
      expiresAt: new Date(Date.now() + 86400000), // 24 hours from now
      status: "active",
      relatedIncidentId: 1,
      sentTo: [1]
    });

    this.createAlert({
      title: "Hate Speech Detection",
      description: "Social media monitoring detected increased ethnic-targeted hate speech in Kaduna area.",
      alertType: "social_media",
      severity: "high",
      source: "social_monitoring",
      expiresAt: new Date(Date.now() + 86400000), // 24 hours from now
      status: "active",
      relatedIncidentId: null,
      sentTo: [1]
    });

    this.createAlert({
      title: "Community Displacement",
      description: "Multiple families reported leaving villages due to threats from suspected bandits.",
      alertType: "humanitarian",
      severity: "medium",
      source: "community_report",
      expiresAt: new Date(Date.now() + 86400000), // 24 hours from now
      status: "active",
      relatedIncidentId: null,
      sentTo: [1]
    });

    // Create social trends
    this.createSocialTrend({
      platform: "twitter",
      keyword: "#SecurityNigeria",
      volume: 1250,
      sentiment: -0.65,
      location: "Nationwide",
      source: "Twitter API",
      relatedIncidentTypes: ["militancy", "banditry"]
    });

    this.createSocialTrend({
      platform: "twitter",
      keyword: "#BornoState",
      volume: 850,
      sentiment: -0.8,
      location: "Borno",
      source: "Twitter API",
      relatedIncidentTypes: ["militancy"]
    });

    this.createSocialTrend({
      platform: "facebook",
      keyword: "FarmerHerder",
      volume: 425,
      sentiment: -0.55,
      location: "Benue",
      source: "Facebook API",
      relatedIncidentTypes: ["farmer-herder"]
    });

    // Create a response plan
    this.createResponsePlan({
      title: "Armed Conflict Response Plan",
      description: "Comprehensive response plan for armed conflicts",
      incidentType: "militancy",
      severity: "critical",
      steps: [
        { order: 1, title: "Incident Verification", description: "Verify the reports with local security agencies" },
        { order: 2, title: "Secure Area", description: "Deploy security personnel to secure the affected area" },
        { order: 3, title: "Evacuate Civilians", description: "Coordinate evacuation of civilians if necessary" },
        { order: 4, title: "Medical Response", description: "Deploy medical teams to treat casualties" }
      ],
      contactAgencies: [
        { name: "Nigeria Army", contact: "army@example.com", role: "Security" },
        { name: "Nigeria Police", contact: "police@example.com", role: "Security" },
        { name: "Red Cross", contact: "redcross@example.com", role: "Medical" }
      ],
      resources: [
        { type: "Personnel", quantity: 50, description: "Security personnel" },
        { type: "Vehicle", quantity: 10, description: "Armored vehicles" },
        { type: "Medical", quantity: 5, description: "Medical teams" }
      ],
      createdBy: 1
    });
  }
}

export const storage = new MemStorage();
