# Load Test Taiga avec k6

Ce projet contient des tests de performance pour l'application Taiga en utilisant k6.  
Le but est de simuler différents parcours utilisateurs et d'identifier les limites de performance.

## 🔹 Scénarios testés

Quatre parcours principaux ont été simulés :

| Scénario | Parcours | Répartition de charge |
|----------|----------|----------------------|
| A | Login → Issues List → Search Issue → Logout | 75% |
| B | Login → Issues List → Create Issue → Logout | 15% |
| C | Login → Issues List → Update Issue → Logout | 10% |
| D | Login → Issues List → Search Issue → Delete Issue → Logout | 10% |

## 🔹 Configuration du test

- **VUs totaux** : 110
- **Durée** : 1 min par scénario
- **Executors** : constant-vus
- **Seuils** :
  - `http_req_failed < 1%`
  - `http_req_duration p(99) < 3s` (à ajuster selon les résultats)

## 🔹 Métriques personnalisées

Chaque étape est mesurée avec des tags k6 (Trend) pour identifier les étapes les plus lentes :

- `login_duration`
- `logout_duration`
- `getProjectId_duration`
- `issuesList_duration`
- `searchIssue_duration`
- `createIssue_duration`
- `updateIssue_duration`
- `deleteIssue_duration`

## 🔹 Résultats principaux

| Étape | Temps moyen (ms) | Max (ms) | p95 (ms) |
|-------|------------------|----------|----------|
| Login | 1955 | 4981 | 2928 |
| Logout | 1635 | 4915 | 2432 |
| Get Project | 2232 | 5039 | 3644 |
| Issues List | 1983 | 5028 | 4834 |
| Search Issue | 1942 | 4947 | 4848 |
| Create Issue | 1921 | 5160 | 4885 |
| Update Issue | 2155 | 5032 | 4938 |
| Delete Issue | 2330 | 5093 | 4955 |

> ⚠️ Le seuil `http_req_duration p(99)<3s` a été dépassé, certaines requêtes sont lentes (jusqu'à 5s).

## 🔹 Analyse rapide

Les opérations CRUD sur les issues sont les plus lentes (create, update, delete).  
Les étapes `getProjectId` et `issuesList` sont également consommatrices de temps.  
`login` et `logout` sont relativement rapides, mais le login peut atteindre ~5s dans certains cas.

**Conclusion :**  
Le système supporte les VUs testés, mais certaines opérations dépassent le seuil de performance souhaité. Il faudra optimiser l'API ou revoir la charge pour garantir un temps de réponse <3s.

## 🔹 Exécution

```bash
k6 run tests/load-test.js
```

- Résultats détaillés affichés dans la console (y compris les trends par étape)


## 🔹 Local
- Ces test utilisent une image docker de taiga. Sur votre machine, l'url ne sera surement pas le meme. Vous pouvez la changer dans config.json