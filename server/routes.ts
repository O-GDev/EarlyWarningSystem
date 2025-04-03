import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer } from "ws";
import { 
  insertUserSchema, 
  insertIncidentSchema, 
  insertCallLogSchema, 
  insertAlertSchema,
  insertSocialTrendSchema,
  insertResponsePlanSchema
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer });

  // Setup session store
  const MemoryStoreSession = MemoryStore(session);
  app.use(session({
    secret: 'ewers-secret-key',
    resave: false,
    saveUninitialized: false,
    store: new MemoryStoreSession({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000 // 24 hours
    }
  }));

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport local strategy
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: 'Invalid username or password' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Invalid username or password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Authentication middleware
  const isAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
  };

  // Authentication routes
  app.post('/api/auth/login', (req, res, next) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json({ 
          id: user.id,
          username: user.username, 
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          agency: user.agency
        });
      });
    })(req, res, next);
  });

  app.post('/api/auth/logout', (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  app.get('/api/auth/status', (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      return res.json({ 
        authenticated: true, 
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          agency: user.agency
        } 
      });
    }
    res.json({ authenticated: false });
  });

  // User routes
  app.get('/api/users', isAuthenticated, async (req, res) => {
    try {
      const users = await storage.getUsers();
      // Remove password field from response
      const sanitizedUsers = users.map(user => ({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        agency: user.agency,
        createdAt: user.createdAt
      }));
      res.json(sanitizedUsers);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  app.post('/api/users', isAuthenticated, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const newUser = await storage.createUser(userData);
      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Failed to create user' });
    }
  });

  // Incident routes
  app.get('/api/incidents', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const incidents = await storage.getIncidents(limit);
      res.json(incidents);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch incidents' });
    }
  });

  app.get('/api/incidents/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const incident = await storage.getIncident(id);
      if (!incident) {
        return res.status(404).json({ message: 'Incident not found' });
      }
      res.json(incident);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch incident' });
    }
  });

  app.post('/api/incidents', isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const incidentData = insertIncidentSchema.parse({
        ...req.body,
        reportedBy: user.id
      });
      const newIncident = await storage.createIncident(incidentData);
      
      // Broadcast to all connected clients
      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            type: 'NEW_INCIDENT',
            data: newIncident
          }));
        }
      });
      
      res.status(201).json(newIncident);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Failed to create incident' });
    }
  });

  app.put('/api/incidents/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const incident = await storage.getIncident(id);
      if (!incident) {
        return res.status(404).json({ message: 'Incident not found' });
      }
      
      const updatedIncident = await storage.updateIncident(id, req.body);
      
      // Broadcast to all connected clients
      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            type: 'UPDATE_INCIDENT',
            data: updatedIncident
          }));
        }
      });
      
      res.json(updatedIncident);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update incident' });
    }
  });

  // Call Log routes
  app.get('/api/call-logs', isAuthenticated, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const callLogs = await storage.getCallLogs(limit);
      res.json(callLogs);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch call logs' });
    }
  });

  app.post('/api/call-logs', isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const callLogData = insertCallLogSchema.parse({
        ...req.body,
        loggedBy: user.id
      });
      const newCallLog = await storage.createCallLog(callLogData);
      res.status(201).json(newCallLog);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Failed to create call log' });
    }
  });

  // Alert routes
  app.get('/api/alerts', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const alerts = await storage.getAlerts(limit);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch alerts' });
    }
  });

  app.post('/api/alerts', isAuthenticated, async (req, res) => {
    try {
      const alertData = insertAlertSchema.parse(req.body);
      const newAlert = await storage.createAlert(alertData);
      
      // Broadcast to all connected clients
      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            type: 'NEW_ALERT',
            data: newAlert
          }));
        }
      });
      
      res.status(201).json(newAlert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Failed to create alert' });
    }
  });

  // Social Trends routes
  app.get('/api/social-trends', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const socialTrends = await storage.getSocialTrends(limit);
      res.json(socialTrends);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch social trends' });
    }
  });

  app.post('/api/social-trends', isAuthenticated, async (req, res) => {
    try {
      const socialTrendData = insertSocialTrendSchema.parse(req.body);
      const newSocialTrend = await storage.createSocialTrend(socialTrendData);
      res.status(201).json(newSocialTrend);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Failed to create social trend' });
    }
  });

  // Response Plans routes
  app.get('/api/response-plans', isAuthenticated, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const responsePlans = await storage.getResponsePlans(limit);
      res.json(responsePlans);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch response plans' });
    }
  });

  app.post('/api/response-plans', isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const responsePlanData = insertResponsePlanSchema.parse({
        ...req.body,
        createdBy: user.id
      });
      const newResponsePlan = await storage.createResponsePlan(responsePlanData);
      res.status(201).json(newResponsePlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Failed to create response plan' });
    }
  });

  // Stats route for dashboard
  app.get('/api/stats', async (req, res) => {
    try {
      const incidents = await storage.getIncidents();
      const alerts = await storage.getAlerts();
      const socialTrends = await storage.getSocialTrends();
      
      const activeIncidents = incidents.filter(i => i.status === 'active').length;
      const newReportsToday = incidents.filter(i => {
        const today = new Date();
        const reportDate = new Date(i.reportedAt);
        return reportDate.getDate() === today.getDate() &&
               reportDate.getMonth() === today.getMonth() &&
               reportDate.getFullYear() === today.getFullYear();
      }).length;
      
      const socialMediaAlerts = socialTrends.length;
      
      const resolvedIncidents = incidents.filter(i => i.status === 'resolved').length;
      
      res.json({
        activeIncidents,
        newReportsToday,
        socialMediaAlerts,
        resolvedIncidents
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch stats' });
    }
  });

  // WebSocket connection handler
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    // Send initial connection acknowledgment
    try {
      ws.send(JSON.stringify({ type: 'CONNECTED', message: 'Connection established' }));
    } catch (sendError) {
      console.error('Error sending initial message:', sendError);
    }
    
    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        console.log('Received message:', parsedMessage);
        
        // Handle different message types
        if (parsedMessage.type === 'PING') {
          try {
            ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
          } catch (sendError) {
            console.error('Error sending PONG response:', sendError);
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        // Send error response to client
        try {
          ws.send(JSON.stringify({ 
            type: 'ERROR', 
            message: 'Failed to process message', 
            timestamp: Date.now() 
          }));
        } catch (sendError) {
          console.error('Error sending error message:', sendError);
        }
      }
    });
    
    ws.on('close', (code, reason) => {
      console.log(`Client disconnected from WebSocket with code: ${code}, reason: ${reason.toString() || 'No reason provided'}`);
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket connection error:', error.message);
      // Close connection on error to allow client to reconnect
      try {
        ws.close(1011, 'Server error occurred');
      } catch (closeError) {
        console.error('Error closing WebSocket connection:', closeError);
      }
    });
  });
  
  // Handle WebSocket server errors
  wss.on('error', (error) => {
    console.error('WebSocket server error:', error.message);
    
    // Attempt to recover from server errors
    setTimeout(() => {
      try {
        // Notify all clients of the error
        wss.clients.forEach(client => {
          try {
            if (client.readyState === 1) { // OPEN
              client.send(JSON.stringify({ 
                type: 'SERVER_ERROR', 
                message: 'Server experienced an error, please refresh',
                timestamp: Date.now()
              }));
            }
          } catch (sendError) {
            console.error('Error notifying client of server error:', sendError);
          }
        });
      } catch (notifyError) {
        console.error('Error notifying clients of server error:', notifyError);
      }
    }, 1000);
  });

  return httpServer;
}
