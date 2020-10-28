// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ====================
// Entorno
// ====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ====================
// Google CLIENT ID
// ====================
process.env.CLIENT_ID = process.env.CLIENT_ID || '500094100186-5nle7341t2kmme0lk72rf7lctsr2h6g3.apps.googleusercontent.com';


// ====================
// Vencimiento del token
// ====================
// 60 segundos * 60 minutos * 24 horas * 30 días
process.env.CADUCIDAD_TOKEN = '48h';

// ====================
// SEED de autentificación
// ====================
process.env.SEED = process.env.SEED ||'este-es-el-seed-desarrollo';


// ====================
// Base de datos Mongo
// ====================
let urlDB;
 if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cursonode'; 
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;