# Gestion de Commandes ABC-Cooeration

## Description

ABC Corporation est une entreprise spécialisée dans l'importation et l'exportation de produits. Dans le cadre de la modernisation et de l'optimisation de la gestion de ses activités, l'entreprise souhaite à nouveau mettre en place un système de gestion des commandes développé en Node.js, avec une base de données MySQL. Ce système permettra de gérer les clients, les produits, les commandes et les paiements.

## Prérequis

- Node.js (v18 ou supérieur)
- MySQL (v8.0 ou supérieur)

## Installation

1. Clonez ce dépôt sur votre machine locale :

```bash
   git clone https://github.com/MohamedSoumare/gestion-commandes-v2-abc-coperation.git
```

2. Naviguez dans le répertoire du projet :

```bash
   cd gestion-commandes-v2-abc-coperation
```

3. Installez les dépendances :

```bash
  npm install
```

4. Configurez la base de données :
   - Créez une base de données MySQL nommée `abc_orders_mangement`
   - Importez le schéma de la base de données à partir du fichier `database/order_mangement.sql`

5. Configurez les paramètres de connexion à la base de données :
   - Ouvrez le fichier `database/db.js`
   - Modifiez les paramètres de connexion selon votre configuration MySQL


## Utilisation

Pour lancer l'application, exécutez la commande suivante :

```bash
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

1. **Gestion des clients:**  Ajouter, afficher, modifier et supprimer des clients.
2. **Gestion des produits:** Ajouter, afficher, modifier et supprimer des produits.
3. **Gestion des commandes:** Créer des commandes avec plusieurs détails.Afficher, modifier et supprimer des commandes
4. **Gestion des paiements:**  Gérer les paiements associés aux commandes.


## Author

-[MohamedSoumare](https://github.com/MohamedSoumare)

