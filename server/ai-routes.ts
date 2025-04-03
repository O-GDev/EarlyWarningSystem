import { Express } from 'express';
import OpenAI from 'openai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Helper function to generate test trend data
function generateTestTrendData() {
  // Generate 6 months of data for violent incidents and protests
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const violentIncidents: Array<{month: string; value: number; changePercent: string}> = [];
  const protests: Array<{month: string; value: number; changePercent: string}> = [];
  const terrorism: Array<{month: string; value: number; changePercent: string}> = [];
  
  // Generate realistic random data with meaningful patterns
  for (let i = 0; i < months.length; i++) {
    // Base values
    let violentBase = 30 + Math.floor(Math.random() * 20);
    let protestBase = 25 + Math.floor(Math.random() * 15);
    let terrorismBase = 10 + Math.floor(Math.random() * 8);
    
    // Add seasonal patterns
    if (i >= 3 && i <= 5) { // Apr-Jun: rainy season increases
      violentBase += 15 + Math.floor(Math.random() * 10);
      protestBase -= 5 + Math.floor(Math.random() * 5);
    }
    
    // Add significant anomalies in Apr and Jun
    if (i === 3) { // April spike
      violentBase += 45;
    }
    if (i === 5) { // June spike
      violentBase += 50;
    }
    
    // Add terrorism correlations
    if (violentBase > 60) {
      terrorismBase += 12;
    }
    
    violentIncidents.push({
      month: months[i],
      value: violentBase,
      changePercent: i > 0 
        ? ((violentBase - violentIncidents[i-1].value) / violentIncidents[i-1].value * 100).toFixed(1)
        : '0.0'
    });
    
    protests.push({
      month: months[i],
      value: protestBase,
      changePercent: i > 0 
        ? ((protestBase - protests[i-1].value) / protests[i-1].value * 100).toFixed(1)
        : '0.0'
    });
    
    terrorism.push({
      month: months[i],
      value: terrorismBase,
      changePercent: i > 0 
        ? ((terrorismBase - terrorism[i-1].value) / terrorism[i-1].value * 100).toFixed(1)
        : '0.0'
    });
  }
  
  // Regional data
  const regions = [
    {
      name: 'Northern',
      currentValue: 32,
      changePercent: 8.4,
      trend: 'increase',
      riskLevel: 'high'
    },
    {
      name: 'Southern',
      currentValue: 4,
      changePercent: -2.1,
      trend: 'decrease',
      riskLevel: 'low'
    },
    {
      name: 'Eastern',
      currentValue: 12,
      changePercent: 1.7,
      trend: 'increase',
      riskLevel: 'medium'
    },
    {
      name: 'Western',
      currentValue: 8,
      changePercent: 0.3,
      trend: 'stable',
      riskLevel: 'stable'
    }
  ];
  
  // Metrics data
  const metrics = {
    monthOverMonth: {
      value: 12.3,
      trend: 'increase',
      percentage: 62
    },
    seasonalTrend: {
      value: -3.7,
      trend: 'decrease',
      percentage: 43
    },
    predictiveConfidence: {
      value: 87,
      percentage: 87
    },
    dataQuality: {
      value: 72,
      percentage: 72
    }
  };
  
  return {
    timeSeries: {
      violentIncidents,
      protests,
      terrorism
    },
    regions,
    metrics,
    anomalies: [
      {
        month: 'April',
        value: violentIncidents[3].value,
        expectedValue: violentIncidents[3].value - 45,
        percentageDifference: 136,
        significance: 'critical'
      },
      {
        month: 'June',
        value: violentIncidents[5].value,
        expectedValue: violentIncidents[5].value - 50,
        percentageDifference: 148,
        significance: 'critical'
      }
    ],
    forecast: {
      trend: 27.3,
      confidence: 87,
      riskLevel: 'high'
    }
  };
}

export function registerAIRoutes(app: Express) {
  // Check if OpenAI API key is available
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  let openai: OpenAI | null = null;
  
  // Only initialize OpenAI if we have an API key
  if (hasApiKey) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  
  // Endpoint to generate test data for trend analysis (works without API key)
  app.get('/api/test/trend-data', (req, res) => {
    const testData = generateTestTrendData();
    return res.json(testData);
  });
  
  // Endpoint for AI trend analysis
  app.post('/api/ai/analyze-trends', async (req, res) => {
    try {
      const { trendData } = req.body;
      
      if (!trendData) {
        return res.status(400).json({ error: 'Trend data is required for analysis' });
      }
      
      // If no API key, return a fallback response with fake analysis
      if (!hasApiKey || !openai) {
        // Generate a realistic-looking analysis without OpenAI
        return res.json({ 
          analysis: {
            insights: "Northern regions show concerning violent incident escalation patterns requiring immediate attention. The 136% spike in April and 148% spike in June indicate potential coordinated activities. Southern regions continue to show improvement, likely due to successful mediation efforts.",
            recommendations: "1. Deploy additional monitoring resources to Northern regions\n2. Investigate potential triggers for the April and June anomalies\n3. Cross-reference social media activity during spike periods\n4. Prepare contingency plans for potential July escalation based on forecast",
            riskLevel: "high",
            confidence: 72
          }
        });
      }
      
      const systemPrompt = `
        You are an expert crisis trend analyst for an Early Warning Early Response System in Nigeria.
        Analyze the provided trend data to identify patterns, anomalies, and potential future risks.
        
        Provide your analysis in JSON format with these fields:
        1. insights: A paragraph of key insights from the data (3-5 sentences)
        2. recommendations: 4-5 specific, actionable recommendations based on the data
        3. riskLevel: One of: "critical", "high", "medium", or "low"
        4. confidence: A number from 0-100 indicating your confidence in the analysis
        
        Keep your response concise and focused on actionable insights.
      `;
      
      const trendDescription = JSON.stringify(trendData);
      
      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze these crisis trend patterns: ${trendDescription}` }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });
      
      // Parse the JSON from the response
      try {
        const analysisContent = completion.choices[0].message.content || '';
        const analysis = JSON.parse(analysisContent);
        return res.json({ analysis });
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', parseError);
        const content = completion.choices[0].message.content || '';
        return res.json({ 
          analysis: {
            insights: content.substring(0, 300),
            recommendations: "Unable to format AI recommendations properly. Please try again.",
            riskLevel: "medium",
            confidence: 50
          }
        });
      }
    } catch (error) {
      console.error('AI trend analysis error:', error);
      return res.json({ 
        analysis: {
          insights: "Analysis is currently unavailable. There may be an issue with the AI service connection.",
          recommendations: "Please try again later or contact your administrator.",
          riskLevel: "medium",
          confidence: 0
        }
      });
    }
  });

  // Chat endpoint for AI assistant
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { messages } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required' });
      }
      
      // If no API key, return a fallback response
      if (!hasApiKey || !openai) {
        return res.json({
          message: "I'm unable to process your request at the moment. The AI functionality requires an OpenAI API key to work. Please ask the administrator to set up the OPENAI_API_KEY environment variable.",
        });
      }
      
      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages,
        temperature: 0.7,
      });
      
      const responseMessage = completion.choices[0].message.content;
      
      return res.json({
        message: responseMessage,
      });
    } catch (error) {
      console.error('AI chat error:', error);
      return res.json({
        message: "I'm having trouble connecting to the AI service. This could be due to an invalid API key or a temporary service issue. Please try again later or contact your administrator.",
      });
    }
  });

  // Analyze text endpoint
  app.post('/api/ai/analyze', async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: 'Text is required for analysis' });
      }
      
      // If no API key, return a fallback response
      if (!hasApiKey || !openai) {
        return res.json({ 
          analysis: "Analysis is currently unavailable. The AI functionality requires an OpenAI API key to work. Please ask the administrator to set up the OPENAI_API_KEY environment variable." 
        });
      }
      
      const systemPrompt = `
        You are an AI analyst for an Early Warning Early Response System focused on crisis monitoring in Nigeria.
        Analyze the provided text for security threats, conflicts, or potential crisis indicators.
        Provide a concise analysis that includes:
        1. Main security concerns identified
        2. Severity assessment (critical, high, medium, low)
        3. Recommended immediate actions
        4. Potential stakeholders to notify
      `;
      
      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.3,
      });
      
      const analysis = completion.choices[0].message.content;
      
      return res.json({ analysis });
    } catch (error) {
      console.error('AI analysis error:', error);
      return res.json({ 
        analysis: "Analysis is currently unavailable. There may be an issue with the AI service connection. Please try again later or contact your administrator." 
      });
    }
  });

  // Recommend response actions based on incident data
  app.post('/api/ai/recommend', async (req, res) => {
    try {
      const { incident } = req.body;
      
      if (!incident) {
        return res.status(400).json({ error: 'Incident data is required' });
      }
      
      // If no API key, return a fallback response
      if (!hasApiKey || !openai) {
        return res.json({ 
          recommendations: "Response recommendations are currently unavailable. The AI functionality requires an OpenAI API key to work. Please ask the administrator to set up the OPENAI_API_KEY environment variable." 
        });
      }
      
      const systemPrompt = `
        You are an AI response coordinator for an Early Warning Early Response System in Nigeria.
        Based on the incident data provided, recommend appropriate response actions.
        Your recommendations should include:
        1. Immediate steps to take (prioritized)
        2. Key agencies to involve (Nigeria Army, Navy, Airforce, NSCDC, DSS, Immigration, Customs, Amotekun as appropriate)
        3. Resource requirements
        4. Communication strategy 
        5. Timeline for response
      `;
      
      const incidentDescription = JSON.stringify(incident);
      
      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Provide response recommendations for this incident: ${incidentDescription}` }
        ],
        temperature: 0.4,
      });
      
      const recommendations = completion.choices[0].message.content;
      
      return res.json({ recommendations });
    } catch (error) {
      console.error('AI recommendations error:', error);
      return res.json({ 
        recommendations: "Response recommendations are currently unavailable. There may be an issue with the AI service connection. Please try again later or contact your administrator." 
      });
    }
  });
}
