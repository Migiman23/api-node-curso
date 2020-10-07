// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ====================
// Entorno
// ====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ====================
// Base de datos
// ====================
let urlDB;
 if(process.env.NODE_ENV){
    urlDB = 'mongodb://localhost:27017/cursonode'; 
} else {
    urlDB = 'mongodb+srv://Migiman23:manclp1@cluster0.xowgh.mongodb.net/cursonode?retryWrites=true&w=majority';
}
process.env.URLDB = urlDB;