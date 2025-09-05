const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const dataDir = path.join(__dirname, 'data');
const adminFile = path.join(dataDir, 'admin.json');

async function setupAdmin() {
    console.log('=== Configuración del Panel de Administración ===\n');
    
    // Ensure data directory exists
    await fs.ensureDir(dataDir);
    
    let adminData = {};
    let isNewSetup = true;
    
    // Check if admin file exists
    if (await fs.pathExists(adminFile)) {
        isNewSetup = false;
        adminData = await fs.readJson(adminFile);
        console.log('Configuración actual:');
        console.log(`- Usuario: ${adminData.username}`);
        console.log(`- Email: ${adminData.email}`);
        console.log(`- Creado: ${new Date(adminData.createdAt).toLocaleString()}`);
        console.log('\n¿Desea actualizar la configuración? (s/n)');
    } else {
        console.log('Configuración inicial del panel de administración.');
    }
    
    const shouldContinue = await new Promise((resolve) => {
        if (isNewSetup) return resolve(true);
        
        readline.question('> ', (answer) => {
            resolve(answer.toLowerCase() === 's');
        });
    });
    
    if (!shouldContinue) {
        console.log('Operación cancelada.');
        process.exit(0);
    }
    
    // Get admin details
    const getInput = (question, defaultValue = '') => {
        return new Promise((resolve) => {
            const q = defaultValue ? 
                `${question} (${defaultValue}): ` : 
                `${question}: `;
                
            readline.question(q, (answer) => {
                resolve(answer || defaultValue);
            });
        });
    };
    
    try {
        // Get admin details
        const username = await getInput('Nombre de usuario', adminData.username || 'admin');
        const email = await getInput('Correo electrónico', adminData.email || 'admin@example.com');
        let password = await getInput('Nueva contraseña (dejar en blanco para mantener la actual)', '');
        
        // If it's a new setup or password is being changed
        if (isNewSetup || password) {
            if (!password) {
                console.log('Debe proporcionar una contraseña para la configuración inicial.');
                process.exit(1);
            }
            
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            adminData.password = hashedPassword;
        }
        
        // Update admin data
        adminData.username = username;
        adminData.email = email;
        adminData.updatedAt = new Date().toISOString();
        
        if (isNewSetup) {
            adminData.createdAt = new Date().toISOString();
            console.log('\nConfiguración del administrador completada.');
        } else {
            console.log('\nConfiguración del administrador actualizada.');
        }
        
        // Save to file
        await fs.writeJson(adminFile, adminData, { spaces: 2 });
        
        console.log('\nCredenciales de acceso:');
        console.log(`- URL: http://localhost:3001/admin`);
        console.log(`- Usuario: ${username}`);
        if (password) {
            console.log(`- Contraseña: [la que acaba de configurar]`);
        }
        console.log('\n¡Importante! Guarde esta información en un lugar seguro.');
        
    } catch (error) {
        console.error('Error durante la configuración:', error.message);
    } finally {
        readline.close();
    }
}

// Run setup
setupAdmin().catch(console.error);
