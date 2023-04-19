# Architecture Logicielle TP2
### Antoine DEPOISIER & Jules FINCK

<p align="center">
  <img src="images/archi2.png" alt="drawing"/>
</p>

## Choix d'architecture

Pour la réalisation de ce TP, nous avons décidé d'utiliser le style architectural de type "composants et connecteurs".

## Les Composants

Notre application comporte 3 composants : 

### La Chaudière

Ce composant n'effectue pas de calcul, il réalise juste le stockage du stockage de données. Il stocke juste si la chaudière est allumé ou éteinte.

Pour permettres aux autres composants de connaitre l'état de la chaudière, une inteface a été créé pour accéder à son état.

// Insérer du code ici

// Insérer un dessin avec le point d'entré

### Le Thermostat

Ce composant effectue un calcul, mais il le fait uniquement par soucis de moyen technique. C'est à dire que nous n'avons pas un vrai thermostat connecté à requeter, donc nous avons fait en sorte que toutes les 5 secondes où la chaudière est alumé, la température va augmenter d'un degré.

// Insérer du code ici

Ce composant sert au stockage de la température ambiante.

Ce composant ne possède pas d'interface, aucun agent externe ne peut le requeter.

// Insérer un dessin sans points d'entrés

### Le Controleur

A chaque fois que le controleur recoit une nouvelle température, il va effectuer différentes actions selons les données stockées en mémoire.

Il y a plusieurs scénario.

Tout d'abord, si le dernier rapport est un échec et date de moins de 5 minutes, ou bien si le disjoncteur est éteint, il ne va rien faire.

// Insérer le code du if

Dans un second temps, si le système est en mode programmé, il va alumer la chaudière chaudière si l'ont se trouve dans la plage horaire programmé et si elle est éteinte.

// Insérer le code du if 

Dans un dernier temps, si la température mesuré est différente de la température référante avec une fourchette de 2° C, il va soit alumer la chaudière ou l'éteindre selon la différence et l'état actuel de la chaudière.

// Insérer le code du if

Le controleur possède une interface pour permettre au thermostat de lui envoyer la température mesure Tm.

// Insérer un dessin avec le point d'entré

## Les Connecteurs

### Thermostat - Controleur

Avec l'interface du controleur, le thermostat envoie la température ambiante.
Comme dit précédemment, par soucis de moyen technique, cette interface renvoie le fait que la chaudière soit allumé ou non.
Le thermostat stocke cette valeur pour augmenter ou descendre la température.

// Insérerer le code de comment le thermostat communique avec le controleur

// Insérer un dessin avec communication entre les deux

### Controleur - Chaudière

De part l'interface de la chaudière, le controleur peut décider d'allumer ou d'éteindre la chaudière.
A la fin de l'instruction, la chaudière renvoie un rapport sur son fonctionnement.

// Insérer code de comment le controleur communique avec la chaudière

// Insérer un dessin avec communication entre les deux

## Système complet

// Insérer un dessin aavec le systeme en entier

## Conclusion


