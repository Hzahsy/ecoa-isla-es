const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const helmet = require('helmet');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost',
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost:8100',
  'http://localhost:4200',
  'http://localhost:5173',
  'http://localhost:3001',
  'http://localhost:5000'
];

const corsOptions = {
  origin: function (origin, callback) {
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, only allow specific origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 204,
  exposedHeaders: ['Authorization']
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static(path.join(__dirname, '../')));

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Ensure directories exist
const submissionsDir = path.join(__dirname, 'submissions');
const dataDir = path.join(__dirname, 'data');
fs.ensureDirSync(submissionsDir);
fs.ensureDirSync(dataDir);

// Admin credentials file
const adminFile = path.join(dataDir, 'admin.json');

// Initialize admin credentials if not exists
if (!fs.existsSync(adminFile)) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('admin123', salt);
    
    const adminData = {
        username: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
        createdAt: new Date().toISOString()
    };
    
    fs.writeJsonSync(adminFile, adminData, { spaces: 2 });
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Security headers middleware
app.use((req, res, next) => {
  // Add security headers to all responses
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Feature-Policy', "geolocation 'none'; microphone 'none'; camera 'none'");
  next();
});

// Mobile login endpoint
app.post('/api/mobile/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username and password are required' 
            });
        }
        
        const adminData = await fs.readJson(adminFile);
        
        if (adminData.username !== username || !bcrypt.compareSync(password, adminData.password)) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
        
        // Generate JWT token with 7 days expiration
        const token = jwt.sign(
            { 
                username: adminData.username,
                role: 'admin',
                isMobile: true
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({ 
            success: true, 
            token,
            user: {
                username: adminData.username,
                email: adminData.email,
                role: 'admin'
            }
        });
    } catch (error) {
        console.error('Mobile login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during authentication' 
        });
    }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Usuario y contraseña son requeridos' });
        }
        
        const adminData = await fs.readJson(adminFile);
        
        if (adminData.username !== username || !bcrypt.compareSync(password, adminData.password)) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
        
        const token = jwt.sign(
            { username: adminData.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({ success: true, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Get all submissions (admin only)
app.get('/api/admin/submissions', authenticateToken, async (req, res) => {
    try {
        const files = await fs.readdir(submissionsDir);
        const submissions = [];
        
        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(submissionsDir, file);
                const data = await fs.readJson(filePath);
                submissions.push({
                    id: path.basename(file, '.json'),
                    ...data
                });
            }
        }
        
        // Sort by date (newest first)
        submissions.sort((a, b) => {
            return new Date(b.fechaSolicitud || b.submissionDate) - new Date(a.fechaSolicitud || a.submissionDate);
        });
        
        // Calculate stats
        const total = submissions.length;
        const completed = submissions.filter(s => s.status === 'Completado').length;
        const pending = submissions.filter(s => !s.status || s.status === 'Pendiente').length;
        const urgent = submissions.filter(s => s.status === 'Urgente').length;
        
        res.json({
            success: true,
            total,
            completed,
            pending,
            urgent,
            submissions: submissions.slice(0, 100) // Return only the first 100 submissions
        });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ success: false, message: 'Error al cargar las solicitudes' });
    }
});

// Get single submission (admin only)
app.get('/api/admin/submissions/:id', authenticateToken, async (req, res) => {
    try {
        const filePath = path.join(submissionsDir, `${req.params.id}.json`);
        
        if (!await fs.pathExists(filePath)) {
            return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
        }
        
        const data = await fs.readJson(filePath);
        res.json({ success: true, ...data });
    } catch (error) {
        console.error('Error fetching submission:', error);
        res.status(500).json({ success: false, message: 'Error al cargar la solicitud' });
    }
});

// Update submission status (admin only)
app.put('/api/admin/submissions/:id/complete', authenticateToken, async (req, res) => {
    try {
        const filePath = path.join(submissionsDir, `${req.params.id}.json`);
        
        if (!await fs.pathExists(filePath)) {
            return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
        }
        
        const data = await fs.readJson(filePath);
        data.status = 'Completado';
        data.updatedAt = new Date().toISOString();
        
        await fs.writeJson(filePath, data, { spaces: 2 });
        
        res.json({ success: true, message: 'Solicitud actualizada correctamente' });
    } catch (error) {
        console.error('Error updating submission:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar la solicitud' });
    }
});

// Delete submission (admin only)
app.delete('/api/admin/submissions/:id', authenticateToken, async (req, res) => {
    try {
        const filePath = path.join(submissionsDir, `${req.params.id}.json`);
        
        if (!await fs.pathExists(filePath)) {
            return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
        }
        
        await fs.remove(filePath);
        res.json({ success: true, message: 'Solicitud eliminada correctamente' });
    } catch (error) {
        console.error('Error deleting submission:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar la solicitud' });
    }
});

// Handle form submission (public)
app.post('/api/submit-form', async (req, res) => {
    try {
        const formData = req.body;
        
        if (!formData.nombre || !formData.telefono) {
            return res.status(400).json({ success: false, error: 'Nombre y teléfono son campos requeridos' });
        }

        // Create a safe filename from the name
        const safeName = formData.nombre
            .toLowerCase()
            .replace(/[^a-z0-9áéíóúüñ]/gi, '_')
            .replace(/_{2,}/g, '_')
            .replace(/^_+|_+$/g, '');

        // Add timestamp to make filename unique
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileId = `${safeName}-${timestamp}`;
        const filePath = path.join(submissionsDir, `${fileId}.json`);

        // Add submission metadata
        formData.id = fileId;
        formData.submissionDate = new Date().toISOString();
        formData.status = 'Pendiente';

        // Save to file
        await fs.writeJson(filePath, formData, { spaces: 2 });
        
        res.status(200).json({ 
            success: true, 
            message: '¡Gracias por tu solicitud! Nos pondremos en contacto contigo pronto.',
            submissionId: fileId
        });
    } catch (error) {
        console.error('Error saving form submission:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.'
        });
    }
});

// Serve admin panel files
app.get('/admin*', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin`);
});
