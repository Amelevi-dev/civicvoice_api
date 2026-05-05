# CivicVoice

## Présation du projet

CivicVoice est une plateforme numérique de participation citoyenne conçue pour renforcer la communication entre les citoyens et les autorités locales au Mali.

La solution permet aux collectivités territoriales d’organiser des consultations citoyennes numériques simples, accessibles et transparentes. Les citoyens peuvent participer aux votes, consulter les résultats et suivre les engagements pris par les autorités après chaque consultation.

Le projet a été développé dans le cadre du MIABE HACKATHON.

---

# Problématique

Au Mali, la participation citoyenne reste limitée entre les périodes électorales. Les citoyens ont peu de moyens simples et accessibles pour exprimer leurs avis sur les décisions locales qui impactent leur quotidien.

CivicVoice répond à ce problème en proposant :
- une plateforme légère et accessible mobile,
- un système de consultation numérique,
- un espace transparent de suivi des engagements des autorités.

---

# Fonctionnalités principales

## Application mobile citoyenne
- Création de compte
- Connexion sécurisée
- Consultation des votes en cours
- Participation aux consultations citoyennes
- Visualisation des résultats
- Consultation des engagements des autorités

## Dashboard autorité (Backoffice)
- Authentification des autorités
- Création de consultations citoyennes
- Suivi des statistiques de participation
- Visualisation dynamique des résultats
- Publication d’engagements officiels
- Gestion des consultations

## Backend API
- Gestion des utilisateurs
- Authentification JWT
- Gestion des consultations
- Gestion des votes
- Gestion des engagements
- API REST sécurisée

---

# Technologies utilisées

## Frontend Mobile
- React Native
- Expo Go
- React Navigation
- Axios
- AsyncStorage

## Backoffice Web
- React.js
- Vite
- TailwindCSS
- Recharts

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Déploiement
- Render (Backend)
- Firebase Hosting / Expo (Frontend)

---

# Architecture du projet

## Backend
```bash
civicvoice_api/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── services/
│   └── configs/
