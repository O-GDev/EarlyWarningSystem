import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertIncidentSchema
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

export async function registerSimpleRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

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

  // Basic health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'EWERS API is running' });
  });

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

  return httpServer;
}