# Gestion de Commandes ABC-Cooeration

Ce projet est un système de gestion de commandes développé en Node.js avec une base de données MySQL. Il permet de gérer des clients, des produits, des commandes et des paiements.

## Prérequis

- Node.js (v18 ou supérieur)
- MySQL (v8.0 ou supérieur)

## Installation

1. Clonez ce dépôt sur votre machine locale :
   ```
   git clone https://github.com/MohamedSoumare/gestion-commandes-v2-abc-coperation.git
   ```

2. Naviguez dans le répertoire du projet :
   ```
   cd gestion-commandes-v2-abc-coperation
   ```

3. Installez les dépendances :
   ```
   npm install
   ```

4. Configurez la base de données :
   - Créez une base de données MySQL nommée `gestion_commandes`
   - Importez le schéma de la base de données à partir du fichier `database/schema.sql`

5. Configurez les paramètres de connexion à la base de données :
   - Ouvrez le fichier `database/db.js`
   - Modifiez les paramètres de connexion selon votre configuration MySQL


## Utilisation

Pour lancer l'application, exécutez la commande suivante :

```
npm start
```

L'application démarre en mode interactif dans la console. Suivez les instructions à l'écran pour naviguer dans les différentes options :

1. Gestion des clients
2. Gestion des produits
3. Gestion des commandes
4. Gestion des paiements

## Structure du projet

- `app.js` : Point d'entrée de l'application
- `database/` : Configuration de la base de données
- `src/` : Modules de l'application
  - `customersModule.js` : Gestion des clients
  - `productsModule.js` : Gestion des produits
  - `purchaseOrdersModule.js` : Gestion des commandes
  - `paymentsModule.js` : Gestion des paiements


## Fonctionnalités

- Ajouter, afficher, modifier et supprimer des clients
- Ajouter, afficher, modifier et supprimer des produits
- Créer des commandes avec plusieurs détails
- Afficher, modifier et supprimer des commandes
- Gérer les paiements associés aux commandes

## Author

- Mohamed Soumare